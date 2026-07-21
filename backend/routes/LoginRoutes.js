import express from "express";
import { logout, verificaPassword } from "../controllers/utilizadorController.js";
import { verificaPasswordStore } from "../controllers/utilizadorComprasController.js";

const router = express.Router();

//Verifica se login esta correto
router.post("/login", verificaPassword);

//Trata do logout, apagando a cookie de sessao do HTTP
router.post("/logout", logout)

//Verifica se login da loja esta correto
router.post("/loginStore", verificaPasswordStore);

export default router;