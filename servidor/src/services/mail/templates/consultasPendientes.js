import { layout } from "./layout.js";
import {
  heading,
  paragraph,
  subheading,
  quoteBox,
  button,
  divider,
} from "./components.js";
import { BRAND, THEME } from "../config.js";

export function consultasPendientesEmail({ consultas = [] } = {}) {
  const total = consultas.length;

  const items = consultas
    .map((c, idx) => {
      const producto = c.productoNombre || "(producto eliminado)";
      const cliente = c.clienteNombre || "(cliente eliminado)";
      const email = c.clienteEmail || "";
      const tiempo = c.tiempoRelativo || "";

      const clienteLinea = email
        ? `<b>${cliente}</b> · <a href="mailto:${email}" style="color:${THEME.primary};text-decoration:none;">${email}</a>`
        : `<b>${cliente}</b>`;

      const metaLinea = tiempo
        ? `<span style="color:${THEME.textMuted};font-size:12px;">${tiempo}</span>`
        : "";

      const header = `
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0 8px;">
          <tr>
            <td style="color:${THEME.primary};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">${producto}</td>
            <td style="text-align:right;">${metaLinea}</td>
          </tr>
        </table>`;

      return `${idx > 0 ? divider() : ""}${header}${quoteBox(c.texto || "—")}${paragraph(clienteLinea, { muted: true })}`;
    })
    .join("");

  const content = `
    ${heading(`Tienes ${total} ${total === 1 ? "consulta pendiente" : "consultas pendientes"}`)}
    ${paragraph(
      "Estas consultas de clientes siguen sin respuesta. Te dejamos el detalle para que las puedas atender desde el panel de administración.",
      { muted: true }
    )}

    ${items}

    ${button({ label: "Abrir panel de consultas", href: `${BRAND.storeUrl}#/d/consultas` })}
  `;

  return layout({
    title: "Consultas pendientes",
    preheader: `${total} ${total === 1 ? "consulta sin responder" : "consultas sin responder"} en ${BRAND.name}`,
    content,
  });
}
