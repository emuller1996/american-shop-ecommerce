import sharp from "sharp";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const UPLOADS_ROOT = path.join(process.cwd(), "uploads");

export async function guardarImagenWebp(tempFilePath, folder) {
  const destDir = path.join(UPLOADS_ROOT, folder);
  fs.mkdirSync(destDir, { recursive: true });

  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.webp`;
  const destPath = path.join(destDir, filename);

  await sharp(tempFilePath)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(destPath);

  return { relativeUrl: `/uploads/${folder}/${filename}` };
}

export function eliminarImagenLocal(relativeUrl) {
  if (!relativeUrl) return;
  const filePath = path.join(process.cwd(), relativeUrl);
  fs.rm(filePath, { force: true }, () => {});
}
