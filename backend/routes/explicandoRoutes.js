import express from "express";
import { createExplicando, getAllExplicandos, getExplicando, updateExplicando, deleteExplicando } from "../controllers/explicandoController.js";

const router = express.Router();

//CRUD
//GET - Read
router.get("/", getAllExplicandos);
router.get("/:id", getExplicando);

//POST - Create
router.post("/", createExplicando);

//PUT - Update
router.put("/:id", updateExplicando);

//DELETE - Delete
router.delete("/:id", deleteExplicando);

export default router;