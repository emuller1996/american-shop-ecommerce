import { createTransport } from "nodemailer";
import { SMTP } from "./config.js";

let transporter = null;

export function getTransporter() {
  if (transporter) return transporter;

  transporter = createTransport({
    host: SMTP.host,
    port: SMTP.port,
    secure: SMTP.secure,
    auth: {
      user: SMTP.user,
      pass: SMTP.pass,
    },
    tls: {
      rejectUnauthorized: SMTP.rejectUnauthorized,
    },
  });

  return transporter;
}
