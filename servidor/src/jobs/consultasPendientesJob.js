import cron from "node-cron";
import consultaService from "../modules/consultas/consultaService.js";
import { sendConsultasPendientesEmail } from "../services/mail/index.js";

const LOG_PREFIX = "[cron/consultas-pendientes]";

const DEFAULT_TO = "estefano.muller13@gmail.com";
const DEFAULT_TZ = "America/Bogota";
const DEFAULT_SCHEDULE = "0 8 * * *";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function tiempoRelativo(createdTime) {
  if (!createdTime) return "";
  const diff = Date.now() - Number(createdTime);
  if (Number.isNaN(diff) || diff < 0) return "";

  if (diff < HOUR) return "hace unos minutos";
  if (diff < DAY) {
    const horas = Math.floor(diff / HOUR);
    return `hace ${horas} ${horas === 1 ? "hora" : "horas"}`;
  }
  const dias = Math.floor(diff / DAY);
  return `hace ${dias} ${dias === 1 ? "día" : "días"}`;
}

async function enriquecerConsulta(consulta) {
  const [producto, cliente] = await Promise.all([
    consulta.product_id
      ? consultaService.obtenerDocumentoPorId(consulta.product_id).catch(() => null)
      : null,
    consulta.client_id
      ? consultaService.obtenerDocumentoPorId(consulta.client_id).catch(() => null)
      : null,
  ]);

  return {
    texto: consulta.consulta ?? "",
    productoNombre: producto?.name ?? null,
    clienteNombre: cliente?.name_client ?? null,
    clienteEmail: cliente?.email_client ?? null,
    tiempoRelativo: tiempoRelativo(consulta.createdTime),
  };
}

async function ejecutar(to) {
  try {
    const pendientes = await consultaService.buscarConsultasPendientes();

    if (pendientes.length === 0) {
      console.log(`${LOG_PREFIX} sin pendientes`);
      return;
    }

    const consultas = await Promise.all(pendientes.map(enriquecerConsulta));

    console.log(`${LOG_PREFIX} enviando resumen con ${consultas.length} consultas a ${to}`);
    await sendConsultasPendientesEmail({ to, consultas });
  } catch (err) {
    console.error(`${LOG_PREFIX} error ejecutando job:`, err.message);
  }
}

export function startConsultasPendientesJob() {
  const enabled = (process.env.CRON_CONSULTAS_PENDIENTES_ENABLED ?? "true") !== "false";
  if (!enabled) {
    console.log(`${LOG_PREFIX} deshabilitado vía CRON_CONSULTAS_PENDIENTES_ENABLED=false`);
    return null;
  }

  const to = process.env.CRON_CONSULTAS_PENDIENTES_TO || DEFAULT_TO;
  const timezone = process.env.CRON_CONSULTAS_PENDIENTES_TZ || DEFAULT_TZ;
  const schedule = process.env.CRON_CONSULTAS_PENDIENTES_SCHEDULE || DEFAULT_SCHEDULE;

  if (!cron.validate(schedule)) {
    console.error(`${LOG_PREFIX} expresión cron inválida: "${schedule}". Job no agendado.`);
    return null;
  }

  const task = cron.schedule(schedule, () => ejecutar(to), { timezone });
  console.log(`${LOG_PREFIX} agendado "${schedule}" (${timezone}) → ${to}`);
  return task;
}
