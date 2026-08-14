import { layout } from "./layout.js";
import { heading, paragraph, button } from "./components.js";
import { BRAND } from "../config.js";

export function resetPasswordEmail({ resetUrl }) {
  const content = `
    ${heading("Restablecer tu contraseña")}
    ${paragraph(
      `Recibimos una solicitud para restablecer la contraseña de tu cuenta en ${BRAND.name}. Este enlace expira en 8 horas.`
    )}
    ${button({ label: "Restablecer contraseña", href: resetUrl })}
    ${paragraph(
      "Si no solicitaste este cambio, ignora este correo — tu contraseña actual seguirá siendo válida.",
      { muted: true }
    )}
  `;

  return layout({
    title: "Restablecer contraseña",
    preheader: `Restablece tu contraseña en ${BRAND.name}. Este enlace vence en 8 horas.`,
    content,
  });
}
