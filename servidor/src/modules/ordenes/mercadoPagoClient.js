import axios from "axios";

const MP_BASE = "https://api.mercadopago.com/v1/payments";

const authHeader = () => ({
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
});

export async function crearPagoMercadoPago(payment) {
  const { data } = await axios.post(MP_BASE, payment, { headers: authHeader() });
  return data;
}

export async function obtenerPagoMercadoPago(id) {
  const { data } = await axios.get(`${MP_BASE}/${id}`, { headers: authHeader() });
  return data;
}
