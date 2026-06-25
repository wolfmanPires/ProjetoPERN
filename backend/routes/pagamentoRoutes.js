import express from "express";
import { createPagamento, getAllPagamentos, getPagamento, updatePagamento, deletePagamento } from "../controllers/pagamentoController.js";

const router = express.Router();

//CRUD
//GET - Read
router.get("/", getAllPagamentos);
router.get("/:id", getPagamento);

//POST - Create
router.post("/", createPagamento);

//PUT - Update
router.put("/:id", updatePagamento);

//DELETE - Delete
router.delete("/:id", deletePagamento);

export default router;