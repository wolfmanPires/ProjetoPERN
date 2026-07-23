import express from 'express'
import { getUtilizadorGestor, updateUtilizadorComprasPasswordless } from '../controllers/utilizadorComprasController.js';
import { getAllEncomendasWithUsers } from '../controllers/encomendaController.js';

const router = express.Router();

//Mudar dados de recorrencia de uma explicacao
router.put("/gestorUpdateUtilizadorComprasPasswordless/:id", updateUtilizadorComprasPasswordless)

//Receber todas as encomendas com dados do utilizador
router.get("/getAllEncomendasWithUsers", getAllEncomendasWithUsers)

//Receber todos os utilizadores com dados de serem gestores
router.get("/getUtilizadorGestor", getUtilizadorGestor)


export default router;