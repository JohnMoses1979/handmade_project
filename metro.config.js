// Learn more: https://docs.expo.dev/guides/customizing-metro/
require("dotenv").config();

const http = require("http");
const https = require("https");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

const trimTrailingSlash = (value) => String(value || "").trim().replace(/\/+$/, "");

const resolveBackendTarget = () => {
  const configuredUrl =
    process.env.EXPO_PUBLIC_API_PROXY_TARGET?.trim() ||
    process.env.EXPO_PUBLIC_API_URL?.trim() ||
    "";

  if (configuredUrl) {
    const normalized = trimTrailingSlash(configuredUrl).replace(/\/api\/?$/, "");
    if (/^https?:\/\//i.test(normalized)) {
      return normalized;
    }
  }

  return "http://192.168.0.21:8085";
};

const backendTarget = resolveBackendTarget();

const proxyRequest = (req, res) => {
  const targetUrl = new URL(req.url || "/", backendTarget);
  const isHttps = targetUrl.protocol === "https:";
  const client = isHttps ? https : http;

  const headers = { ...req.headers };
  headers.host = targetUrl.host;
  delete headers.origin;
  delete headers.referer;

  const proxyReq = client.request(
    {
      protocol: targetUrl.protocol,
      hostname: targetUrl.hostname,
      port: targetUrl.port || (isHttps ? 443 : 80),
      method: req.method,
      path: `${targetUrl.pathname}${targetUrl.search}`,
      headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on("error", (error) => {
    console.error(`[metro-proxy] ${targetUrl.pathname}:`, error.message);
    if (!res.headersSent) {
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json");
    }
    res.end(JSON.stringify({ success: false, message: "Proxy request failed." }));
  });

  req.pipe(proxyReq);
};

config.server = config.server || {};
const originalEnhanceMiddleware = config.server.enhanceMiddleware;

config.server.enhanceMiddleware = (middleware, metroServer) => {
  const baseMiddleware = originalEnhanceMiddleware
    ? originalEnhanceMiddleware(middleware, metroServer)
    : middleware;

  return (req, res, next) => {
    const requestUrl = req.url || "";
    if (requestUrl.startsWith("/api/") || requestUrl === "/api" || requestUrl.startsWith("/uploads/") || requestUrl === "/uploads") {
      proxyRequest(req, res);
      return;
    }

    baseMiddleware(req, res, next);
  };
};

module.exports = config;
