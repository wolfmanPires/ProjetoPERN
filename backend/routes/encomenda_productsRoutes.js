import express from "express";
import { createEncomendaProduto, deleteEncomendaProduto, getAllEncomendasProdutos, getAllProductsFromEncomenda, getEncomendaProdutoFromBothID, getEncomendaProdutoFromEncomendaID, getEncomendaProdutoFromProductID, updateEncomendaProduto } from "../controllers/encomenda_productsController.js";

const router = express.Router();

//CRUD
//GET - Read
router.get("/getAllEncomendasProdutos", getAllEncomendasProdutos);
router.get("/getEncomendaProdutoFromEncomendaID/:id", getEncomendaProdutoFromEncomendaID);
router.get("/getEncomendaProdutoFromProductID/:id", getEncomendaProdutoFromProductID);
router.get("/getEncomendaProdutoFromBothID/", getEncomendaProdutoFromBothID);
router.get("/getAllProductsFromEncomenda/:id", getAllProductsFromEncomenda);

//POST - Create
router.post("/", createEncomendaProduto);

//PUT - Update
router.put("/", updateEncomendaProduto);

//DELETE - Delete
router.delete("/", deleteEncomendaProduto);

export default router;