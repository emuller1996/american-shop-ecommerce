import { BRAND } from "../config.js";
import { escapeHtml } from "../utils.js";
import { heading, infoTable, paragraph, subheading } from "./components.js";
import { layout } from "./layout.js";

export function orderStatusEnCamino(orden) {
  const cliente = orden?.cliente ?? {};

  const nombre = escapeHtml(cliente.name_client ?? "");

  const infoRows = [
    {
      label: "Empresa transportista",
      value: escapeHtml(orden?.transportadora || ""),
    },
    { label: "Número de guía", value: escapeHtml(orden?.numero_guia || "") },
    { label: "Fecha de envío", value: escapeHtml(orden?.fecha_envio || "") },
  ];

  const content = `
        ${heading("Tu Pedido está en Camino")}
        ${paragraph(`Estimado/a <b>${nombre}</b>,`, { muted: true })}

        ${paragraph(
          `Le informamos que su pedido Nº ${orden?._id} ha sido despachado y ya se encuentra en camino a su dirección de entrega.`,
          { muted: true },
        )}

        ${subheading(" Detalles del envío:")}
       
        ${infoTable(infoRows)}

        ${paragraph(
          `Puede realizar el seguimiento de su pedido ingresando el número de guía en el sitio web de la transportista o a través de nuestro portal de clientes.`,
          { muted: true },
        )}

        ${paragraph(
          `Si tiene alguna duda o inconveniente, no dude en responder a este correo o comunicarse con nosotros a través de nuestros canales de atención.`,
          { muted: true },
        )}

        ${paragraph(
          `Agradecemos su confianza y preferencia.`,
          { muted: true },
        )}
      `;

  return layout({
    title: "Tu Pedido está en Camino",
    preheader: `Hemos recibido tu pedido en ${BRAND.name}`,
    content,
  });
}
