import express from 'express'
import { getExplicadoresAndUtilizador } from '../controllers/explicadorController.js';
import { getUtilizadorAsGestores, getUtilizadorLimited, updateUtilizadorNET } from '../controllers/utilizadorController.js';
import { getExplicandosAndUtilizador } from '../controllers/explicandoController.js';
import { getAllNotasWithUtilizador } from '../controllers/notasController.js';
import { getAllAvalFuturasWithUtilizador } from '../controllers/avaliacoes_futurasController.js';
import { getAllPagamentosWithUtilizador } from '../controllers/pagamentoController.js';
import { getExplicacoesGestores, updateExplicRecorrencia } from '../controllers/explicacaoController.js';

const router = express.Router();

//Obter todos os explicadores e os seus respetivos dados de utilizador
router.get("/gestorAllExplicadores/", getExplicadoresAndUtilizador)

//Obter todos os explicadores e os seus respetivos dados de utilizador
router.get("/gestorAllExplicandos/", getExplicandosAndUtilizador)

//Obter todos os gestores e os seus respetivos dados de utilizador
router.get("/gestorAllGestores/", getUtilizadorAsGestores)

//Atualizar um utilizador em especifico no nome, email e telemovel
router.put("/gestorUpdateUtilizador/:id", updateUtilizadorNET)

//Obter todas as notas e os seus respetivos dados de explicando e disciplina
router.get("/gestorAllNotas/", getAllNotasWithUtilizador)

//Obter todas as avaliacoes futuras e os seus respetivos dados de utilizador e explicando
router.get("/gestorAllAvalFuturas/", getAllAvalFuturasWithUtilizador)

//Obter todos os pagamentos e os seus respetivos dados de utilizador
router.get("/gestorAllPagamentos/", getAllPagamentosWithUtilizador)

//Obter todos os utilizadores (dados limitados)
router.get("/gestorAllUsersLimit/", getUtilizadorLimited)

//Obter todas as explicacoes e os seus respetivos dados de utilizador
router.get("/gestorAllExplicacoes/", getExplicacoesGestores)

//Mudar dados de recorrencia de uma explicacao
router.put("/gestorChangeRecorrencia", updateExplicRecorrencia)

export default router;