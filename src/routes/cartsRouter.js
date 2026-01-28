import express from "express";
import CartManager from "../managers/CartManager.js";
import ProductManager from "../managers/ProductManager.js";

const router = express.Router();

const cartManager = new CartManager();
const productManager = new ProductManager();

// POST /api/carts+
// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/carts/:id
// Obtener un carrito por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await cartManager.getCartById(id);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const populatedProducts = await Promise.all(
      cart.products.map(async (p) => {
        const product = await productManager.getProductById(p.product);
        return {
          product: product || { id: p.product, deleted: true },
          quantity: p.quantity,
        };
      })
    );

    res.json({ id: cart.id, products: populatedProducts });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/carts/:cid/product/:pid
// Agregar un producto al carrito
router.post("/:id/product", async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity = 1 } = req.body;
    const qty = parseInt(quantity, 10);

    if (!productId) {
      return res.status(400).json({ error: "productId es obligatorio" });
    }

    if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      return res
        .status(400)
        .json({ error: "quantity debe ser un entero mayor a cero" });
    }

    // Validar producto
    const product = await productManager.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const updatedCart = await cartManager.addProductToCart(
      id,
      productId,
      qty
    );

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(updatedCart);
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    
    if (error.message && error.message.includes('Stock insuficiente')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE /api/carts/:cid/products/:pid
// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updated = await cartManager.deleteProductFromCart(cid, pid);
    if (!updated) return res.status(404).json({ error: "Carrito o producto no encontrado" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PUT /api/carts/:cid
// Actualizar productos del carrito
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const productsArray = req.body;
    if (!Array.isArray(productsArray)) {
      return res.status(400).json({ error: "Error en el formato de los productos" });
    }
    const updated = await cartManager.updateCartProducts(cid, productsArray);
    if (!updated) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PUT /api/carts/:cid/products/:pid
// Actualizar cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (quantity == null || isNaN(Number(quantity))) {
      return res.status(400).json({ error: "quantity es obligatorio y debe ser numérico" });
    }
    const updated = await cartManager.updateProductQuantity(cid, pid, quantity);
    if (!updated) return res.status(404).json({ error: "Carrito o producto no encontrado" });
    res.json(updated);
  } catch (error) {
    console.error("Error al actualizar cantidad de producto en carrito:", error);
    if (error.message && error.message.includes('Stock insuficiente')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE /api/carts/:cid
// Vaciar el carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const updated = await cartManager.clearCart(cid);
    if (!updated) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
