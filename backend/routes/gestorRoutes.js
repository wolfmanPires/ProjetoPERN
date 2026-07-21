import express from "express";
import { createGestor, deleteGestor, getAllGestores, getGestor, updateGestor } from "../controllers/gestorController.js";

const router = express.Router();

//CRUD
//GET - Read
router.get("/", getAllGestores);
router.get("/:id", getGestor);

//POST - Create
router.post("/", createGestor);

//PUT - Update
router.put("/:id", updateGestor);

//DELETE - Delete
router.delete("/:id", deleteGestor);

export default router;