import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ProductManager from "../managers/ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const productsFilePath = path.join(__dirname, "../../data/products.json");
const productManager = new ProductManager(productsFilePath);

// GET /api/products
// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/products/:id
// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productManager.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/products
// Agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await productManager.addProduct(productData);
    
    // Emitir evento de socket para actualización en tiempo real
    const io = req.app.get("io");
    const products = await productManager.getProducts();
    io.emit("updateProducts", products);
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/products/:id
// Actualizar un producto por ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await productManager.updateProduct(id, updates);
    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE /api/products/:id
// Eliminar un producto por ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await productManager.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Emitir evento de socket para actualización en tiempo real
    const io = req.app.get("io");
    const products = await productManager.getProducts();
    io.emit("updateProducts", products);

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
