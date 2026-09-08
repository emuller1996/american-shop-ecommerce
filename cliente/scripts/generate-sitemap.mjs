import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_URL = (process.env.VITE_SITE_URL || "").replace(/\/$/, "");
const API_BASE_URL = (process.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const BUILD_DIR = path.resolve(__dirname, "..", "build");

const STATIC_PATHS = ["/", "/contactanos", "/eco/puntos-ventas/"];

async function getAllProductPaths() {
  const paths = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data } = await axios.get(`${API_BASE_URL}/productos/published`, {
      params: { page, perPage },
    });

    for (const producto of data.data) {
      paths.push(`/eco/${producto._id}/producto`);
    }

    if (page >= data.total_pages) break;
    page += 1;
  }

  return paths;
}

function buildXml(urls) {
  const items = urls
    .map((url) => `  <url>\n    <loc>${SITE_URL}${url}</loc>\n  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

async function main() {
  if (!SITE_URL) {
    console.warn("[generate-sitemap] VITE_SITE_URL no está definida, se omite la generación del sitemap.");
    return;
  }

  let productPaths = [];
  try {
    productPaths = await getAllProductPaths();
  } catch (error) {
    console.error("[generate-sitemap] error obteniendo productos:", error.message);
  }

  const xml = buildXml([...STATIC_PATHS, ...productPaths]);

  if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR, { recursive: true });
  }

  fs.writeFileSync(path.join(BUILD_DIR, "sitemap.xml"), xml, "utf-8");
  console.log(`[generate-sitemap] sitemap.xml generado con ${STATIC_PATHS.length + productPaths.length} URLs.`);
}

main();
