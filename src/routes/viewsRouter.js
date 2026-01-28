import express from "express";
import ProductManager from "../managers/ProductManager.js";
import CartManager from "../managers/CartManager.js";

const router = express.Router();

const productManager = new ProductManager();
const cartManager = new CartManager();
const PAGINATION_OPTIONS = [5, 10, 15];

// GET / 
// Vista home con lista de productos
router.get("/", (req, res) => {
  res.redirect('/products');
});

// GET /products 
// Vista con productos paginados
router.get("/products", async (req, res) => {
  try {
    const categories = productManager.getCategories();
    const defaultCart = await cartManager.getOrCreateDefaultCart();

    res.render("home", {
      title: "Productos",
      categories,
      cartId: defaultCart.id,
      limitOptions: PAGINATION_OPTIONS,
      query: req.query,
    });
  } catch (error) {
    res.render("home", { title: "Productos", categories: [], limitOptions: PAGINATION_OPTIONS });
  }
});

// GET /products/:pid 
// Detalle de producto
router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    if (!product) return res.status(404).render("product", { error: "Producto no encontrado" });
    
    const defaultCart = await cartManager.getOrCreateDefaultCart();
    res.render("product", { product, cartId: defaultCart.id });
  } catch (error) {
    res.status(500).render("product", { error: "Error interno del servidor" });
  }
});

// GET /carts/:cid 
// Vista de carrito con productos
router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).render("cart", { error: "Carrito no encontrado" });

    const populated = cart.products.map((p) => ({
      product: p.product,
      quantity: p.quantity
    }));

    // Calcular total
    const totalPrice = populated.reduce((sum, item) => {
      return sum + (item.product.price || 0) * item.quantity;
    }, 0).toFixed(2);

    const warningMessage = cart.cleanedProducts > 0 
      ? `Se eliminaron ${cart.cleanedProducts} producto(s) que ya no están disponibles` 
      : null;

    res.render("cart", { id: cart.id, products: populated, totalPrice, warningMessage });
  } catch (error) {
    res.status(500).render("cart", { error: "Error interno del servidor" });
  }
});

// GET /realTimeProducts 
// Vista de productos en tiempo real
router.get("/realTimeProducts", async (req, res) => {
  try {
    const result = await productManager.getProducts({ limit: 1000, page: 1 });
    const categories = productManager.getCategories();
    res.render("realTimeProducts", {
      title: "Real Time Products",
      products: result.docs || result,
      categories,
      limitOptions: PAGINATION_OPTIONS,
    });
  } catch (error) {
    const categories = productManager.getCategories();
    res.render("realTimeProducts", {
      title: "Real Time Products",
      products: [],
      categories,
      limitOptions: PAGINATION_OPTIONS,
    });
  }
});

export default router;
