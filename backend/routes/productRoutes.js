import express from "express";
import { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct } from "../controllers/productController.js";

const router = express.Router();

//CRUD
//GET - Read
router.get("/", getAllProducts);
router.get("/:id", getProduct);

//POST - Create
router.post("/", createProduct);

//PUT - Update
router.put("/:id", updateProduct);

//DELETE - Delete
router.delete("/:id", deleteProduct);

export default router;