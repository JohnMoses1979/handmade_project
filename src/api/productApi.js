import { Platform } from "react-native";
import { BASE_URL, SERVER_URL } from "./config";

const serverUrl = SERVER_URL;

const toServerImageUrl = (value) => {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    if (trimmed.includes("/uploads/documents/")) {
      const fileName = trimmed.split("/").pop();
      return fileName ? `${serverUrl}/uploads/${encodeURIComponent(fileName)}` : trimmed;
    }
    return trimmed;
  }

  if (trimmed.startsWith("file://")) {
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
};

const toPlainNumberString = (value, fallback = "0") => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : fallback;
  }

  const cleaned = String(value ?? "")
    .replace(/[^\d.-]/g, "")
    .trim();

  if (!cleaned) return fallback;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? String(parsed) : fallback;
};

const toPlainIntegerString = (value, fallback = "0") => {
  const parsed = Number(toPlainNumberString(value, fallback));
  return Number.isFinite(parsed) ? String(Math.round(parsed)) : fallback;
};

const formatProduct = (product = {}) => {
  const imageSources = Array.isArray(product.imagePaths) && product.imagePaths.length > 0
    ? product.imagePaths
    : Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.image
    ? [product.image]
    : [];

  const images = imageSources
    .map(toServerImageUrl)
    .filter(Boolean);

  const approved = String(product.status || "").toUpperCase() === "APPROVED";
  const active = typeof product.active === "boolean" ? product.active : approved;
  const soldOut = Number(product.stock ?? 0) <= 0;

  return {
    ...product,
    id: product.id,
    image: images[0] || null,
    images,
    sellerId: product.sellerId,
    sellerName: product.sellerName,
    visibleToCustomer: approved && active && !soldOut,
    active,
    status: soldOut
      ? "Sold Out"
      : approved && active
      ? "Live"
      : approved
      ? "Hidden"
      : String(product.status || "").toUpperCase() === "REJECTED"
      ? "Rejected"
      : "Pending Approval",
  };
};

const buildProductFormData = async (
  productData,
  images,
  sellerId,
  sellerEmail,
  sellerName,
  { includeImages = true } = {}
) => {
  const formData = new FormData();
  formData.append("sellerId", String(sellerId));
  formData.append("sellerEmail", sellerEmail);
  formData.append("sellerName", sellerName);
  formData.append("name", productData.name);
  formData.append("category", productData.category);
  formData.append("subcategory", productData.subcategory || "");
  formData.append("price", toPlainNumberString(productData.price));
  formData.append("finalPrice", toPlainNumberString(productData.finalPrice));
  formData.append("discount", toPlainIntegerString(productData.discount, "0"));
  formData.append("stock", toPlainIntegerString(productData.stock, "0"));
  formData.append("weight", productData.weight || "");
  formData.append("description", productData.description);
  formData.append("material", productData.material || "");
  formData.append("color", productData.color || "");
  formData.append("size", productData.size || "");
  formData.append(
    "status",
    productData.visibleToCustomer || productData.status === "Live" ? "APPROVED" : "PENDING"
  );
  formData.append("active", String(productData.active ?? true));
  formData.append("paymentStatus", productData.paymentStatus || "Paid");
  formData.append("uploadFee", toPlainNumberString(productData.uploadFee, "0"));
  formData.append("paymentMethod", productData.paymentMethod || "upi");
  formData.append("paidAt", productData.paidAt || new Date().toISOString());

  if (!includeImages || !images || images.length === 0) {
    return formData;
  }

  for (let index = 0; index < images.length; index += 1) {
    const img = images[index];
    if (!img?.uri) continue;

    const fileName = img.fileName || img.name || `product_image_${index}.jpg`;
    const mimeType = img.mimeType || img.type || "image/jpeg";

    if (Platform.OS === "web") {
      let blob = null;

      if (img.file && typeof Blob !== "undefined" && img.file instanceof Blob) {
        blob = img.file;
      } else if (
        typeof img.uri === "string" &&
        (img.uri.startsWith("blob:") ||
          img.uri.startsWith("data:") ||
          img.uri.startsWith("http://") ||
          img.uri.startsWith("https://"))
      ) {
        try {
          blob = await fetch(img.uri).then((res) => res.blob());
        } catch (error) {
          console.warn(`Skipping ${fileName}: unable to read selected image on web.`, error);
          continue;
        }
      }

      if (!blob) {
        console.warn(`Skipping ${fileName}: image file is not available for upload on web.`);
        continue;
      }

      if (blob.size > 25 * 1024 * 1024) {
        console.warn(`Skipping ${fileName}: image is larger than 25MB.`);
        continue;
      }
      formData.append("images", blob, fileName);
      continue;
    }

    formData.append("images", {
      uri: Platform.OS === "android" ? img.uri : img.uri.replace("file://", ""),
      type: mimeType,
      name: fileName,
    });
  }

  return formData;
};

const postProductForm = async (formData) => {
  const response = await fetch(`${BASE_URL}/seller/products/add`, {
    method: "POST",
    body: formData,
  });

  const text = await response.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text.slice(0, 160) };
    }
  }

  return { response, data };
};

const parseJsonResponse = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: text.slice(0, 160) };
  }
};

export const addProductAPI = async (productData, images, sellerId, sellerEmail, sellerName) => {
  try {
    if (!sellerId || !/^\d+$/.test(String(sellerId))) {
      return {
        success: false,
        message: "Approved seller login missing. Please logout and login again as seller.",
      };
    }

    let { response, data } = await postProductForm(
      await buildProductFormData(productData, images, sellerId, sellerEmail, sellerName, {
        includeImages: true,
      })
    );

    if (!response.ok && Platform.OS === "web") {
      console.warn("Retrying product submit on web.", response.status);
      ({ response, data } = await postProductForm(
        await buildProductFormData(productData, images, sellerId, sellerEmail, sellerName, {
          includeImages: true,
        })
      ));
    }

    if (!response.ok && Platform.OS === "web") {
      console.warn("Retrying product submit on web without image upload.", response.status);
      ({ response, data } = await postProductForm(
        await buildProductFormData(productData, images, sellerId, sellerEmail, sellerName, {
          includeImages: false,
        })
      ));
    }

    if (!response.ok) {
      console.error("Add product server response:", response.status, data);
      return {
        success: false,
        message: data.message || `Server Error: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    console.error("Add Product Error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};

export const getAllProductsAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/admin/products`);
    const data = await parseJsonResponse(response);
    return Array.isArray(data) ? data.map(formatProduct) : [];
  } catch (e) {
    console.error("Fetch all products error", e);
    return [];
  }
};

export const getApprovedProductsAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/approved`);
    const data = await parseJsonResponse(response);
    return Array.isArray(data) ? data.map(formatProduct) : [];
  } catch (e) {
    console.error("Fetch approved products error", e);
    return [];
  }
};

export const getProductCatalogAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/catalog`);
    const data = await parseJsonResponse(response);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("Fetch product catalog error", e);
    return [];
  }
};

export const approveProductAPI = async (productId) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/products/${productId}/approve`, {
      method: "POST",
    });
    return await parseJsonResponse(response);
  } catch (e) {
    console.error("Approve product error", e);
    return { success: false };
  }
};

export const rejectProductAPI = async (productId) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/products/${productId}/reject`, {
      method: "POST",
    });
    return await parseJsonResponse(response);
  } catch (e) {
    console.error("Reject product error", e);
    return { success: false };
  }
};

export const getSellerProductsAPI = async (sellerId) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/products/${sellerId}`);
    const data = await parseJsonResponse(response);
    return Array.isArray(data) ? data.map(formatProduct) : [];
  } catch (error) {
    console.error("Fetch seller products error", error);
    return [];
  }
};

export const updateSellerProductAPI = async (productId, payload) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await parseJsonResponse(response);
  } catch (error) {
    console.error("Update seller product error", error);
    return { success: false, message: "Unable to update product." };
  }
};

export const deleteSellerProductAPI = async (productId) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/products/${productId}`, {
      method: "DELETE",
    });
    return await parseJsonResponse(response);
  } catch (error) {
    console.error("Delete seller product error", error);
    return { success: false, message: "Unable to delete product." };
  }
};
