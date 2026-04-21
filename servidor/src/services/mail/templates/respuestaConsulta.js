import { layout } from "./layout.js";
import { heading, paragraph, subheading, quoteBox, button } from "./components.js";
import { BRAND } from "../config.js";
import { escapeHtml, formatDate } from "../utils.js";

export function respuestaConsultaEmail(data) {
  const nombre = escapeHtml(data?.cliente?.name_client ?? "");
  const consulta = escapeHtml(data?.consulta ?? "");
  const respuesta = escapeHtml(data?.respuesta ?? "");
  const autor = escapeHtml(data?.user?.name ?? "");
  const fecha = formatDate(data?.createdTime);

  const metaParts = [];
  if (autor) metaParts.push(`Respondido por <b>${autor}</b>`);
  if (fecha) metaParts.push(fecha);
  const meta = metaParts.join(" · ");

  const content = `
    ${heading("Hemos respondido tu consulta")}
    ${paragraph(
      `Hola <b>${nombre}</b>, te respondimos la consulta que dejaste sobre uno de nuestros productos.`,
      { muted: true }
    )}

    ${subheading("Tu consulta")}
    ${quoteBox(consulta || "—")}

    ${subheading("Nuestra respuesta")}
    ${quoteBox(respuesta || "—")}

    ${meta ? paragraph(meta, { muted: true }) : ""}

    ${button({ label: "Volver a la tienda", href: BRAND.storeUrl })}
  `;

  return layout({
    title: "Respuesta a tu consulta",
    preheader: `Tienes una nueva respuesta en ${BRAND.name}`,
    content,
  });
}
