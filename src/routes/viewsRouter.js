import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ProductManager from "../managers/ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const productsFilePath = path.join(__dirname, "../../data/products.json");
const productManager = new ProductManager(productsFilePath);

// GET / - Vista home con lista de productos
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", {
      title: "Lista de Productos",
      products,
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    res.render("home", {
      title: "Lista de Productos",
      products: [],
    });
  }
});

// GET /realTimeProducts - Vista con websockets
router.get("/realTimeProducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", {
      title: "Real Time Products",
      products,
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    res.render("realTimeProducts", {
      title: "Real Time Products",
      products: [],
    });
  }
});

export default router;
