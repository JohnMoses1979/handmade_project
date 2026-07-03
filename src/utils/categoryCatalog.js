import { SERVER_URL } from "../api/config";

const placeholderImage = require("../../assets/images/placeholder.png");
const serverUrl = SERVER_URL;

const CATEGORY_IMAGE_MAP = {
  Bags: require("../../assets/images/bags.png"),
  Cakes: placeholderImage,
  Candles: require("../../assets/images/candles.png"),
  Cards: require("../../assets/images/cards.png"),
  Decor: require("../../assets/images/decor.png"),
  Dresses: require("../../assets/images/dresses.png"),
  Festive: require("../../assets/images/festive.png"),
  Jewelry: require("../../assets/images/jewelry.png"),
  Paintings: require("../../assets/images/painting.png"),
  Pickles: require("../../assets/images/pickels.png"),
  Pottery: require("../../assets/images/pottery.png"),
  Sweets: require("../../assets/images/sweets.png"),
};

const DEFAULT_CATEGORY_ORDER = [
  "Bags",
  "Cakes",
  "Candles",
  "Cards",
  "Decor",
  "Dresses",
  "Festive",
  "Jewelry",
  "Paintings",
  "Pickles",
  "Pottery",
  "Sweets",
];

const CATEGORY_ALIASES = {
  bag: "Bags",
  bags: "Bags",
  cake: "Cakes",
  cakes: "Cakes",
  candle: "Candles",
  candles: "Candles",
  "candles & soaps": "Candles",
  "candle & soaps": "Candles",
  card: "Cards",
  cards: "Cards",
  "greeting cards": "Cards",
  decor: "Decor",
  "home decor": "Decor",
  decoration: "Decor",
  dress: "Dresses",
  dresses: "Dresses",
  festive: "Festive",
  festival: "Festive",
  "festive items": "Festive",
  jewelry: "Jewelry",
  jewellery: "Jewelry",
  "handmade jewelry": "Jewelry",
  painting: "Paintings",
  paintings: "Paintings",
  pickle: "Pickles",
  pickles: "Pickles",
  pottery: "Pottery",
  "pottery & crafts": "Pottery",
  sweet: "Sweets",
  sweets: "Sweets",
};

export function normalizeCategoryName(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  const lower = raw.toLowerCase();
  return CATEGORY_ALIASES[lower] || raw;
}

function resolveCatalogImage(value) {
  if (!value || typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    if (trimmed.includes("/uploads/documents/")) {
      const fileName = trimmed.split("/").pop();
      return fileName ? `${serverUrl}/uploads/${encodeURIComponent(fileName)}` : trimmed;
    }
    return trimmed;
  }
  if (trimmed.startsWith("file://") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  if (trimmed.startsWith("/uploads/") || trimmed.startsWith("uploads/")) {
    const normalizedPath = trimmed.replace(/^\/+/, "");
    if (normalizedPath.startsWith("uploads/documents/")) {
      const fileName = normalizedPath.split("/").pop();
      return fileName ? `${serverUrl}/uploads/${encodeURIComponent(fileName)}` : null;
    }
    return `${serverUrl}/${normalizedPath}`;
  }

  const fileName = trimmed
    .split("?")[0]
    .split("#")[0]
    .split("/")
    .pop()
    .split("\\")
    .pop();

  return fileName ? `${serverUrl}/uploads/${encodeURIComponent(fileName)}` : null;
}

export function getCategoryImage(category) {
  return CATEGORY_IMAGE_MAP[normalizeCategoryName(category)] || placeholderImage;
}

function createBucket(category, image = null) {
  const normalized = normalizeCategoryName(category) || "Other";
  return {
    id: normalized,
    name: normalized,
    label: normalized,
    image: image || getCategoryImage(normalized),
    count: 0,
    subcategories: [],
  };
}

function sortCatalog(items = []) {
  return [...items].sort((a, b) => {
    const orderA = DEFAULT_CATEGORY_ORDER.indexOf(a.name);
    const orderB = DEFAULT_CATEGORY_ORDER.indexOf(b.name);

    if (orderA !== orderB) {
      if (orderA === -1) return 1;
      if (orderB === -1) return -1;
      return orderA - orderB;
    }

    return a.label.localeCompare(b.label);
  });
}

export function buildCategoryCatalogFromProducts(products = []) {
  const buckets = new Map();

  DEFAULT_CATEGORY_ORDER.forEach((category) => {
    buckets.set(category, createBucket(category));
  });

  (Array.isArray(products) ? products : []).forEach((product) => {
    const category = normalizeCategoryName(product?.category);
    if (!category) return;

    if (!buckets.has(category)) {
      buckets.set(category, createBucket(category, resolveCatalogImage(product?.image)));
    }

    const bucket = buckets.get(category);
    bucket.count += 1;

    const resolvedImage = resolveCatalogImage(product?.image);
    if (resolvedImage && (!bucket.image || bucket.image === placeholderImage)) {
      bucket.image = resolvedImage;
    }

    const subcategory = String(product?.subcategory ?? "").trim();
    if (subcategory && !bucket.subcategories.includes(subcategory)) {
      bucket.subcategories.push(subcategory);
    }
  });

  return sortCatalog(
    Array.from(buckets.values()).map((item) => ({
      ...item,
      subcategories: item.subcategories.sort((a, b) => a.localeCompare(b)),
    }))
  );
}

export function buildCategoryCatalogFromEntries(entries = []) {
  const buckets = new Map();

  DEFAULT_CATEGORY_ORDER.forEach((category) => {
    buckets.set(category, createBucket(category));
  });

  (Array.isArray(entries) ? entries : []).forEach((entry) => {
    const category = normalizeCategoryName(entry?.name ?? entry?.label ?? entry?.category);
    if (!category) return;

    if (!buckets.has(category)) {
      buckets.set(category, createBucket(category, resolveCatalogImage(entry?.image)));
    }

    const bucket = buckets.get(category);
    const entryCount = Number(entry?.count ?? entry?.total ?? 0);
    if (Number.isFinite(entryCount) && entryCount > 0) {
      bucket.count += entryCount;
    }

    const resolvedImage = resolveCatalogImage(entry?.image);
    if (resolvedImage && (!bucket.image || bucket.image === placeholderImage)) {
      bucket.image = resolvedImage;
    }

    const subcategories = Array.isArray(entry?.subcategories)
      ? entry.subcategories
      : Array.isArray(entry?.children)
      ? entry.children
      : [];

    subcategories.forEach((value) => {
      const subcategory = String(value ?? "").trim();
      if (subcategory && !bucket.subcategories.includes(subcategory)) {
        bucket.subcategories.push(subcategory);
      }
    });
  });

  return sortCatalog(
    Array.from(buckets.values()).map((item) => ({
      ...item,
      subcategories: item.subcategories.sort((a, b) => a.localeCompare(b)),
    }))
  );
}
