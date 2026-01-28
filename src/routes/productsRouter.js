import express from "express";
import ProductManager from "../managers/ProductManager.js";

const router = express.Router();

const productManager = new ProductManager();

// GET /api/products
// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const result = await productManager.getProducts({ limit, page, sort, query });

    const pageNum = result.page;
    const totalPages = result.totalPages;

    const hasPrevPage = result.hasPrevPage;
    const hasNextPage = result.hasNextPage;

    const buildLink = (newPage) => {
      if (!newPage) return null;
      const url = new URL(req.protocol + "://" + req.get("host") + req.baseUrl + req.path);
      const params = new URLSearchParams(req.query);
      params.set("page", String(newPage));
      url.search = params.toString();
      return url.toString();
    };

    res.json({
      status: "success",
      payload: result.docs,
      totalPages,
      prevPage: hasPrevPage ? pageNum - 1 : null,
      nextPage: hasNextPage ? pageNum + 1 : null,
      page: pageNum,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? buildLink(pageNum - 1) : null,
      nextLink: hasNextPage ? buildLink(pageNum + 1) : null,
    });
  } catch (error) {
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
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/products
// Agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await productManager.addProduct(productData);
    
    const io = req.app.get("io");
    const result = await productManager.getProducts({ limit: 1000, page: 1 });
    io.emit("updateProducts", result.docs || result);
    
    res.status(201).json(newProduct);
  } catch (error) {
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
    const result = await productManager.getProducts({ limit: 1000, page: 1 });
    io.emit("updateProducts", result.docs || result);

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
