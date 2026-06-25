import express from "express";
import { createAvalFutura, getAllAvalFuturas, getAvalFutura, updateAvalFutura, deleteAvalFutura } from "../controllers/avaliacoes_futurasController.js";

const router = express.Router();

//CRUD
//GET - Read
router.get("/", getAllAvalFuturas);
router.get("/:id", getAvalFutura);

//POST - Create
router.post("/", createAvalFutura);

//PUT - Update
router.put("/:id", updateAvalFutura);

//DELETE - Delete
router.delete("/:id", deleteAvalFutura);

export default router;