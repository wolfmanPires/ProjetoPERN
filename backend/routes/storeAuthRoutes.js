import express from "express";
import { registarUtilizadorCompras, confirmarEmail, reenviarConfirmacao, pedirRecuperacaoPassword, reporPassword, getStoreDashboard } from "../controllers/storeAuthController.js";

const router = express.Router();

//trata do pedido de registar uma conta da loja nova
router.post("/register", registarUtilizadorCompras);

//usada para confirmar o email
router.get("/confirm-email", confirmarEmail);

//usada para re-enviar email de confirmacao
router.post("/reenviar-confirmacao", reenviarConfirmacao);

//recebe os dados para dar reset a password
router.post("/pedir-recuperacao-password", pedirRecuperacaoPassword);

//recebe os dados para dar reset a password, e apos validacao destes muda-la
router.post("/repor-password", reporPassword);

//recebe os dados da dashboard
router.get("/obterDashboard", getStoreDashboard);

export default router;