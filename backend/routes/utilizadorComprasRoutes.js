import express from "express";
import { createUtilizadorCompras, deleteUtilizadorCompras, getAllUtilizadoresCompras, getUtilizadorCompras, updateUtilizadorCompras } from "../controllers/utilizadorComprasController.js";

const router = express.Router();

//CRUD
//GET - Read
router.get("/", getAllUtilizadoresCompras);
router.get("/:id", getUtilizadorCompras);

//POST - Create
router.post("/", createUtilizadorCompras);

//PUT - Update
router.put("/:id", updateUtilizadorCompras);

//DELETE - Delete
router.delete("/:id", deleteUtilizadorCompras);

export default router;