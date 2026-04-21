import { getTransporter } from "./transporter.js";
import { BRAND } from "./config.js";

const buildFromHeader = (label) => {
  const name = label
    ? `${BRAND.fromName.toUpperCase()} (${label.toUpperCase()})`
    : BRAND.fromName.toUpperCase();
  return `"${name}" <${BRAND.supportEmail}>`;
};

export async function sendMail({ to, subject, html, fromLabel = null }) {
  if (!to) {
    console.warn(`[mail] "${subject}" omitido: destinatario vacío`);
    return { ok: false, reason: "no-recipient" };
  }

  const mailOptions = {
    from: buildFromHeader(fromLabel),
    to,
    subject,
    html,
  };

  try {
    const info = await getTransporter().sendMail(mailOptions);
    console.log(`[mail] "${subject}" → ${to}`);
    return { ok: true, info };
  } catch (error) {
    console.error(`[mail] error enviando "${subject}" a ${to}:`, error.message);
    return { ok: false, error };
  }
}
