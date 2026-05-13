import { startConsultasPendientesJob } from "./consultasPendientesJob.js";

export function startAllJobs() {
  startConsultasPendientesJob();
}
