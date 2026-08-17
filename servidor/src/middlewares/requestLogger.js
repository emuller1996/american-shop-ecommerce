import { jwtDecode } from "jwt-decode";
import logService from "../modules/logs/logService.js";

function extraerUsuario(req) {
  const raw = req.headers["access-token"] || req.headers["authorization"];
  if (!raw) return null;
  try {
    return jwtDecode(raw);
  } catch {
    return null;
  }
}

function encode(value) {
  try {
    return Buffer.from(JSON.stringify(value ?? {})).toString("base64");
  } catch {
    return null;
  }
}

export function requestLogger(req, res, next) {
  if (req.method === "OPTIONS" || req.originalUrl.startsWith("/logs")) {
    return next();
  }

  next(); // nunca esperar la escritura del log

  const entry = {
    header: encode(req.headers),
    body: encode(req.body),
    usuario: extraerUsuario(req),
    ip: req.ip,
    endpoint: req.originalUrl,
    method: req.method,
  };

  logService.registrarPeticion(entry).catch((err) => {
    console.error("[requestLogger] error:", err.message);
  });
}
