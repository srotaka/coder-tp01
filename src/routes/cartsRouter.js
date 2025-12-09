import express from "express"
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import CartManager from '../managers/CartManager.js';
import ProductManager from '../managers/ProductManager.js';

const fileName = fileURLToPath(import.meta.url);
const directoryName = dirname(fileName);

const router = express.Router();

const cartsFilePath = path.join(directoryName, '..', '..', 'data', 'carts.json');
const productsFilePath = path.join(directoryName, '..', '..', 'data', 'products.json');

const cartManager = new CartManager(cartsFilePath);
const productManager = new ProductManager(productsFilePath);

// POST /api/carts+
// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error('Error al crear carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/carts/:id
// Obtener un carrito por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await cartManager.getCartById(id);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(cart);
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/carts/:cid/product/:pid
// Agregar un producto al carrito
router.post('/:id/product', async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId es obligatorio' });
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({ error: 'quantity debe ser un entero mayor a cero' });
    }

    // Validar producto
    const product = await productManager.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const updatedCart = await cartManager.addProductToCart(id, productId, quantity);

    if (!updatedCart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(updatedCart);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
