import { sendMail } from "./sender.js";
import { welcomeEmail } from "./templates/welcome.js";
import { orderDetailEmail } from "./templates/orderDetail.js";
import { respuestaConsultaEmail } from "./templates/respuestaConsulta.js";

export async function sendVerificationEmail(email) {
  return sendMail({
    to: email,
    subject: "Bienvenido a American Shop VIP",
    html: welcomeEmail(),
  });
}

export async function sendOrdenDetail(data) {
  return sendMail({
    to: data?.cliente?.email_client,
    subject: "Detalle de tu compra",
    fromLabel: "Detalle de compra",
    html: orderDetailEmail(data),
  });
}

export async function sendRespuestaConsultaEmail(data) {
  return sendMail({
    to: data?.cliente?.email_client,
    subject: "Respuesta a tu consulta",
    fromLabel: "Respuesta a consulta",
    html: respuestaConsultaEmail(data),
  });
}

export const getHTMLOrderDetail = orderDetailEmail;
export const getHTMLRespuestaEmailDetail = respuestaConsultaEmail;
