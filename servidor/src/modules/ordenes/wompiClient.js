import axios from "axios";
import crypto from "crypto";

const WOMPI_BASE = process.env.WOMPI_BASE_URL || "https://sandbox.wompi.co/v1";

export function generarReferenciaOrden() {
  return `AMS-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}

export function generarFirmaIntegridad({ reference, amountInCents, currency = "COP" }) {
  const cadena = `${reference}${amountInCents}${currency}${process.env.WOMPI_INTEGRITY_SECRET}`;
  return crypto.createHash("sha256").update(cadena).digest("hex");
}

export async function obtenerTransaccionWompi(id) {
  const { data } = await axios.get(`${WOMPI_BASE}/transactions/${id}`, {
    headers: { Authorization: `Bearer ${process.env.WOMPI_PUBLIC_KEY}` },
  });
  return data.data; // Wompi envuelve la transacción en { data: {...} }
}

export function verificarFirmaEvento({ properties, timestamp, checksum, dataEvento }) {
  const valores = properties.map((prop) =>
    prop.split(".").reduce((obj, key) => obj?.[key], dataEvento)
  );
  const cadena = `${valores.join("")}${timestamp}${process.env.WOMPI_EVENTS_SECRET}`;
  return crypto.createHash("sha256").update(cadena).digest("hex") === checksum;
}
