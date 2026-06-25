import express from "express";
import { createDisciplina, getAllDisciplinas, getDisciplina, updateDisciplina, deleteDisciplina } from "../controllers/disciplinaController.js";

const router = express.Router();

//CRUD
//GET - Read
router.get("/", getAllDisciplinas);
router.get("/:id", getDisciplina);

//POST - Create
router.post("/", createDisciplina);

//PUT - Update
router.put("/:id", updateDisciplina);

//DELETE - Delete
router.delete("/:id", deleteDisciplina);

export default router;