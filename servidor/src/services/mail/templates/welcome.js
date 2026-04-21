import { layout } from "./layout.js";
import { heading, paragraph, button } from "./components.js";
import { BRAND } from "../config.js";

export function welcomeEmail() {
  const content = `
    ${heading(`¡Bienvenido a ${BRAND.name}!`)}
    ${paragraph(
      "Gracias por registrarte. Tu destino definitivo de moda online ya está listo para ti."
    )}
    ${paragraph(
      "Sumérgete en nuestra colección exclusiva: las últimas tendencias en ropa, los zapatos más cómodos, jeans que se ajustan a tu estilo, gorras, camisetas con diseños únicos y accesorios que son el toque final perfecto.",
      { muted: true }
    )}
    ${paragraph(
      "Aquí no solo compras prendas, expresas quién eres. Estamos emocionados de acompañarte en cada paso de tu estilo.",
      { muted: true }
    )}
    ${button({ label: "Explorar la tienda", href: BRAND.storeUrl })}
  `;

  return layout({
    title: "Bienvenido",
    preheader: `Tu cuenta en ${BRAND.name} está lista.`,
    content,
  });
}
