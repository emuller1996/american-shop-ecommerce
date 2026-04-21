import { layout } from "./layout.js";
import {
  heading,
  paragraph,
  subheading,
  infoTable,
  productsTable,
  button,
  totalRow,
} from "./components.js";
import { BRAND } from "../config.js";
import { escapeHtml, formatCurrency } from "../utils.js";

export function orderDetailEmail(data) {
  const cliente = data?.cliente ?? {};
  const address = data?.address ?? {};
  const productos = Array.isArray(data?.products) ? data.products : [];

  const items = productos.map((p) => {
    const unit = Number(p?.price ?? 0);
    const qty = Number(p?.cantidad ?? 0);
    return {
      name: escapeHtml(p?.producto_data?.name ?? "-"),
      size: escapeHtml(p?.stock_data?.size ?? "-"),
      quantity: qty || 0,
      unitPrice: formatCurrency(unit),
      total: formatCurrency(unit * qty),
    };
  });

  const totalOrden = productos.reduce(
    (sum, p) => sum + Number(p?.price ?? 0) * Number(p?.cantidad ?? 0),
    0
  );

  const infoRows = [
    { label: "Nombre", value: escapeHtml(cliente.name_client) },
    { label: "Teléfono", value: escapeHtml(cliente.phone_client) },
    { label: "Email", value: escapeHtml(cliente.email_client) },
    { label: "Dirección", value: escapeHtml(address.address) },
    { label: "Ciudad", value: escapeHtml(address.city) },
    { label: "Departamento", value: escapeHtml(address.departament) },
  ];

  const nombre = escapeHtml(cliente.name_client ?? "");

  const content = `
    ${heading("Detalle de tu compra")}
    ${paragraph(
      `Hola <b>${nombre}</b>, recibimos tu pedido correctamente. A continuación encontrarás el detalle.`,
      { muted: true }
    )}

    ${subheading("Datos de envío")}
    ${infoTable(infoRows)}

    ${subheading("Productos")}
    ${productsTable(items)}
    ${totalRow("Total de la compra", formatCurrency(totalOrden))}

    ${paragraph(
      "Te contactaremos pronto con los datos de seguimiento. Si tienes alguna pregunta, puedes responder a este correo y con gusto te ayudamos.",
      { muted: true }
    )}

    ${button({ label: "Explorar la tienda", href: BRAND.storeUrl })}
  `;

  return layout({
    title: "Detalle de compra",
    preheader: `Hemos recibido tu pedido en ${BRAND.name}`,
    content,
  });
}
