import { BRAND } from "../config.js";
import { escapeHtml } from "../utils.js";
import { heading, paragraph } from "./components.js";
import { layout } from "./layout.js";

export function orderStatusPreparacion(orden) {
  const cliente = orden?.cliente ?? {};

  const nombre = escapeHtml(cliente.name_client ?? "");

  const content = `
        ${heading("Tu Pedido está en Preparación")}
        ${paragraph(`Estimado/a <b>${nombre}</b>,`, { muted: true })}

        ${paragraph(
          `Le informamos que su pedido Nº ${orden?._id} ha sido registrado correctamente y ya se encuentra en fase de preparación.`,
          { muted: true },
        )}

        ${paragraph(
          `Nuestro equipo está verificando los productos y realizando el embalaje correspondiente para garantizar que todo esté en óptimas condiciones antes del envío. En las próximas horas recibirá un segundo correo con el número de seguimiento y la empresa de mensajería encargada de la entrega.`,
          { muted: true },
        )}

        ${paragraph(
          `Si tiene alguna consulta o requiere asistencia, no dude en responder a este mensaje o contactarnos a través de nuestros canales habituales.`,
          { muted: true },
        )}
      `;

  return layout({
    title: "Tu Pedido está en Preparación",
    preheader: `Hemos recibido tu pedido en ${BRAND.name}`,
    content,
  });
}
