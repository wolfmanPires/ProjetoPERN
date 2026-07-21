import express from "express";
import { createEncomenda, createEncomendaFromCarrinho, deleteEncomenda, getAllEncomendas, getEncomenda, getEncomendasFromUserID, updateEncomenda } from "../controllers/encomendaController.js";

const router = express.Router();

//CRUD
//GET - Read
router.get("/getAllEncomendas", getAllEncomendas);
router.get("/getEncomendaFromID/:id", getEncomenda);
router.get("/getEncomendasFromUserID/:id", getEncomendasFromUserID);

//POST - Create
router.post("/createEncomenda", createEncomenda);
router.post("/createEncomendaFromCarrinho", createEncomendaFromCarrinho);

//PUT - Update
router.put("/:id", updateEncomenda);

//DELETE - Delete
router.delete("/:id", deleteEncomenda);

export default router;