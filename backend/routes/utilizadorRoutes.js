import express from "express";
import { createUtilizador, getAllUtilizadores, getUtilizador, updateUtilizador, deleteUtilizador} from "../controllers/utilizadorController.js";

const router = express.Router();

//CRUD
//GET - Read
router.get("/", getAllUtilizadores);
router.get("/:id", getUtilizador);

//POST - Create
router.post("/", createUtilizador);

//PUT - Update
router.put("/:id", updateUtilizador);

//DELETE - Delete
router.delete("/:id", deleteUtilizador);

export default router;