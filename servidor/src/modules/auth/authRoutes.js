import { Router } from "express";
import { login } from "./authController.js";
import { validateToken } from "../../utils/authjws.js";

const AuthRouters = Router();

// Validación de token admin
AuthRouters.get("/validate", validateToken);

// Login admin
AuthRouters.post("/login", login);

export default AuthRouters;
