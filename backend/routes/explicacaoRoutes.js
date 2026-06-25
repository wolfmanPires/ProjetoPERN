import express from "express";
import { createExplicacao, getAllExplicacoes, getExplicacao, updateExplicacao, deleteExplicacao } from "../controllers/explicacaoController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

//CRUD
//GET - Read
router.get("/", getAllExplicacoes);
router.get("/:id", authMiddleware, getExplicacao);

//POST - Create
router.post("/", createExplicacao);

//PUT - Update
router.put("/:id", updateExplicacao);

//DELETE - Delete
router.delete("/:id", deleteExplicacao);

export default router;