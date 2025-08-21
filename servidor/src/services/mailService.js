import { createTransport } from "nodemailer";
import "dotenv/config";
import { getHTMLOrderDetail, getHTMLRespuestaEmailDetail } from "./MailUtils.js";
// Configurar el transporte SMTP de IONOS
const transporter = createTransport({
  host: "smtp.ionos.com", // Servidor SMTP de IONOS
  port: 465, // Puerto seguro SSL
  secure: true, // true para SSL, false para STARTTLS
  auth: {
    user: process.env.USER_SMTP, // Tu correo de IONOS
    pass: process.env.PASS_SMTP, // Tu contraseña
  },
  tls: {
    rejectUnauthorized: false, // 🔴 Desactiva la verificación del certificado
  },
});

// Función para enviar el correo de verificación
export const sendVerificationEmail = async (email) => {
  const mailOptions = {
    from: '"ECOMMERCE AMERICAN SHOP" <ecommerce-dev@esmuller.cloud>', // Remitente
    to: email, // Destinatario
    subject: "Bienvenido",
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CORREO TEST</title>
    <style>
      * {
        font-family: "Trebuchet MS", Haettenschweiler, "Arial Narrow Bold",
          sans-serif;
      }
      .container {
        margin: auto;
        width: 500px;
      }
      .text-center {
        text-align: center;
      }
      .card-img-top {
        padding: 2em 0 0 0;
          filter: sepia(30%);
  transition: filter 1s;
      }
      .card {
        border: 1px solid red;
        border-radius: 0.5em;
        overflow: hidden;
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
      }
      .card-body {
        padding: 2em;
      }
      hr {
        margin: 0;
      }
      .btn {
        margin-top: 3em;
        background-color: rgba(59, 120, 233, 0.856);
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        padding: 1em;
        color: white;
        border-radius: 0.3em;
        text-decoration: none;
      }
      p {
        margin-bottom: 1em;
      }
    </style>
  </head>
  <body>
    <div class="container mt-5">
      <div class="card shadow" style="border-color: rgb(108, 117, 194)">
        <div
          class="text-center pt-2 m-0 pb-2"
          style="background-color: rgba(59, 120, 233, 0.486)"
        >
          <img
            class="card-img-top"
            src="https://esmuller.cloud/assets/Logo-LBxHafXJ.png"
            alt="Title"
            style="width: 120px"
          />
          <p style="font-weight: 600; color: #03174e; font-size: large">
           AMERICAN SHOP VIP
          </p>
          <hr class="m-0" />
        </div>
        <div class="card-body text-center">
          <p style="white-space: pretty; margin-bottom: 40px; color: #292929;">
            ¡Bienvenido/a  AMERICAN SHOP VIP Ecommerce tu destino definitivo de moda
            online! Sumérgete en nuestra exclusiva colección donde encontrarás
            las últimas tendencias en ropa, los zapatos más cómodos y con
            estilo, jeans que se ajustan a tu personalidad, gorras para coronar
            tu look, camisetas con diseños únicos y accesorios que son el toque
            final perfecto. Aquí no solo compras prendas, sino que expresas
            quién eres. Estamos emocionados de acompañarte en cada paso de tu
            estilo. ¡Explora, elige y deja que tu outfit hable por ti!
          </p>
          <div style="margin-top: 10px">
            <a
              href="https://esmuller.cloud/"
              class="btn btn-danger"
              >Explorar</a
            >
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo de verificación enviado a ${email}`);
  } catch (error) {
    console.error("Error enviando el correo:", error);
  }
};


export const sendOrdenDetail = async (data) => {
  try {
    let html = getHTMLOrderDetail(data);
    console.log(html);
    const mailOptions = {
      from: '"ECOMMERCE AMERICAN SHOP (DETALLE DE COMPRA)" <ecommerce-dev@esmuller.cloud>', // Remitente
      to: data?.cliente?.email_client, // Destinatario
      subject: "DETALLE DE COMPRA",
      html: html,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Correo de verificación enviado a ${data?.cliente?.email_client}`);
  } catch (error) {
    console.error("Error enviando el correo:", error);
  }
};


export const sendRespuestaConsultaEmail = async (data) => {
  try {
    let html = getHTMLRespuestaEmailDetail(data);
    console.log(html);
    const mailOptions = {
      from: '"ECOMMERCE AMERICAN SHOP (RESPUESTA A CONSULTA)" <ecommerce-dev@esmuller.cloud>', // Remitente
      to: data?.cliente?.email_client, // Destinatario
      subject: "RESPUESTA A CONSULTA",
      html: html,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Correo Respuesta se ha enviado a ${data?.cliente?.email_client}`);
  } catch (error) {
    console.error("Error enviando el correo:", error);
  }
};
