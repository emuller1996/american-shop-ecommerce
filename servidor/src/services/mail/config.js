export const BRAND = {
  name: "American Shop VIP",
  tagline: "Tienda Electrónica",
  fromName: "American Shop VIP",
  supportEmail: process.env.USER_SMTP || "ecommerce-dev@esmuller.cloud",
  websiteUrl: "https://esmuller.cloud/",
  storeUrl: "https://ecommerce.esmuller.cloud/",
  logoUrl: "https://esmuller.cloud/assets/Logo-LBxHafXJ.png",
  year: new Date().getFullYear(),
};

export const THEME = {
  primary: "#c93333",
  primaryDark: "#8f1f1f",
  primaryLight: "#fdecec",
  accent: "#ff8080",
  textPrimary: "#1a1a1a",
  textSecondary: "#555555",
  textMuted: "#8a8a8a",
  background: "#f4f4f7",
  cardBackground: "#ffffff",
  border: "#e5e5e5",
  footerBg: "#f7f7f7",
  headerText: "#ffffff",
};

export const SMTP = {
  host: process.env.SMTP_HOST || "smtp.ionos.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: (process.env.SMTP_SECURE ?? "true") === "true",
  user: process.env.USER_SMTP,
  pass: process.env.PASS_SMTP,
  // Por seguridad, el certificado TLS se valida por defecto. Solo se puede
  // desactivar explícitamente con SMTP_REJECT_UNAUTHORIZED=false (útil para
  // entornos de desarrollo con certificados self-signed).
  rejectUnauthorized: (process.env.SMTP_REJECT_UNAUTHORIZED ?? "true") !== "false",
};
