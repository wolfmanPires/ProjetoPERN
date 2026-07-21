import express from "express";
import { createCarrinho, deleteCarrinho, getAllCarrinhos, getCarrinho, updateCarrinho } from "../controllers/carrinhoController.js";

const router = express.Router();

//CRUD
//GET - Read
router.get("/", getAllCarrinhos);
router.get("/:id", getCarrinho);

//POST - Create
router.post("/", createCarrinho);

//PUT - Update
router.put("/:id", updateCarrinho);

//DELETE - Delete
router.delete("/:id", deleteCarrinho);

export default router;