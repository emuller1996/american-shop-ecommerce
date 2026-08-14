import { sendMail } from "./sender.js";
import { welcomeEmail } from "./templates/welcome.js";
import { orderDetailEmail } from "./templates/orderDetail.js";
import { respuestaConsultaEmail } from "./templates/respuestaConsulta.js";
import { consultasPendientesEmail } from "./templates/consultasPendientes.js";
import { resetPasswordEmail } from "./templates/resetPassword.js";

export async function sendVerificationEmail(email) {
  return sendMail({
    to: email,
    subject: "Bienvenido a American Shop VIP",
    html: welcomeEmail(),
  });
}

export async function sendResetPasswordEmail(email, resetUrl) {
  return sendMail({
    to: email,
    subject: "Restablece tu contraseña",
    fromLabel: "Restablecer contraseña",
    html: resetPasswordEmail({ resetUrl }),
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

export async function sendConsultasPendientesEmail({ to, consultas }) {
  return sendMail({
    to,
    subject: `Consultas pendientes (${consultas.length})`,
    fromLabel: "Consultas pendientes",
    html: consultasPendientesEmail({ consultas }),
  });
}

export const getHTMLOrderDetail = orderDetailEmail;
export const getHTMLRespuestaEmailDetail = respuestaConsultaEmail;
