import express from "express";
import { logout, verificaPassword } from "../controllers/utilizadorController.js";

const router = express.Router();

//Verifica se login esta correto
router.post("/login", verificaPassword);

//Trata do logout, apagando a cookie de sessao do HTTP
router.post("/logout", logout)

export default router;