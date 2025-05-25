import express from "express";
import mongoose from "mongoose";
import Product from "../models/product.js";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controller/productc.js";

const router = express.Router();

router.get("/",getProducts);
router.post("/", createProduct);
router.put("/:id",updateProduct);
router.delete("/:id", deleteProduct);

export default router;