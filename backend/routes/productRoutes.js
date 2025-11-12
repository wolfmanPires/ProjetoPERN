import express from "express";
import { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct } from "../controllers/productController.js";

const router = express.Router();

//GET
router.get("/", getAllProducts)
router.get("/:ID", getProduct)

//POST
router.post("/", createProduct)

//PUT
router.put("/:ID", updateProduct)

//DELETE
router.delete("/:ID", deleteProduct)

export default router;