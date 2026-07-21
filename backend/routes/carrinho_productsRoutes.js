import express from "express";
import { createCarrinhoProduto, deleteCarrinhoAllProducts, deleteCarrinhoProduto, getAllCarrinhosProdutos, getAllProductsFromCarrinho, getCarrinhoFromUserCompraID, getCarrinhoProdutoFromBothID, getCarrinhoProdutoFromCarrinhoID, getCarrinhoProdutoFromProductID, updateCarrinhoProduto } from "../controllers/carrinho_productsController.js";

const router = express.Router();

//CRUD
//GET - Read
router.get("/getAllCarrinhosProdutos", getAllCarrinhosProdutos);
router.get("/getCarrinhoProdutoFromCarrinhoID/:id", getCarrinhoProdutoFromCarrinhoID);
router.get("/getCarrinhoProdutoFromProductID/:id", getCarrinhoProdutoFromProductID);
router.get("/getCarrinhoProdutoFromBothID/:id_carrinho/:id_products", getCarrinhoProdutoFromBothID);
router.get("/getCarrinhoFromUserCompraID/:id", getCarrinhoFromUserCompraID);
router.get("/getAllProductsFromCarrinho/:id", getAllProductsFromCarrinho);

//POST - Create
router.post("/", createCarrinhoProduto);

//PUT - Update
router.put("/", updateCarrinhoProduto);

//DELETE - Delete
router.delete("/deleteSingleProduct/", deleteCarrinhoProduto);
router.delete("/deleteAllProducts/:id_carrinho", deleteCarrinhoAllProducts);

export default router;