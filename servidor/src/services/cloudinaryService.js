import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const DEFAULT_FOLDER = process.env.CLOUDINARY_FOLDER || "AmericanImagenes";

function assertConfigured() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error(
      "Cloudinary no está configurado. Revisa CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET en .env"
    );
  }
}

export async function uploadImageFromTempFile(tempFilePath, { folder = DEFAULT_FOLDER } = {}) {
  assertConfigured();
  const result = await cloudinary.uploader.upload(tempFilePath, {
    folder,
    resource_type: "image",
    format: "webp",
  });
  return {
    url: result.secure_url,
    public_id: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    format: result.format,
  };
}

export async function deleteImage(publicId) {
  assertConfigured();
  if (!publicId) return { result: "not_found" };
  return await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}
