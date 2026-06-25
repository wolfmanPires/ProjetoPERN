import express from "express";
import { createExplicador, getAllExplicadores, getExplicador, updateExplicador, deleteExplicador } from "../controllers/explicadorController.js";

const router = express.Router();

//CRUD
//GET - Read
router.get("/", getAllExplicadores);
router.get("/:id", getExplicador);

//POST - Create
router.post("/", createExplicador);

//PUT - Update
router.put("/:id", updateExplicador);

//DELETE - Delete
router.delete("/:id", deleteExplicador);

export default router;