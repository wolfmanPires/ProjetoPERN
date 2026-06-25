import express from "express";
import { createNota, getAllNotas, getNota, updateNota, deleteNota } from "../controllers/notasController.js";

const router = express.Router();

//CRUD
//GET - Read
router.get("/", getAllNotas);
router.get("/:id", getNota);

//POST - Create
router.post("/", createNota);

//PUT - Update
router.put("/:id", updateNota);

//DELETE - Delete
router.delete("/:id", deleteNota);

export default router;