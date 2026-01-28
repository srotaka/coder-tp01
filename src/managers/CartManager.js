import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

class CartManager {
  constructor() {}

  async createCart() {
    const created = await CartModel.create({ products: [] });
    const obj = created.toObject();
    obj.id = obj._id;
    return obj;
  }

  // Obtener o crear un carrito por defecto
  async getOrCreateDefaultCart() {
    // Buscar si existe algún carrito
    let cart = await CartModel.findOne().lean();
    
    if (!cart) {
      // Si no existe, crea uno nuevo
      const created = await CartModel.create({ products: [] });
      cart = created.toObject();
    }
    
    return { ...cart, id: cart._id };
  }

  async getCartById(id) {
    const cart = await CartModel.findById(id).populate("products.product");
    if (!cart) return null;

    // Limpiar productos que ya no existen, eliminados de la BD
    const originalLength = cart.products.length;
    cart.products = cart.products.filter((p) => p.product != null);
    
    // Si se eliminaron productos, guarda el carrito actualizado
    if (cart.products.length < originalLength) {
      await cart.save();
    }

    const doc = cart.toObject();
    return { ...doc, id: doc._id, cleanedProducts: originalLength - cart.products.length };
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    const prod = await ProductModel.findById(productId).lean();
    if (!prod) return null;

    const existing = cart.products.find((p) => String(p.product) === String(productId));
    const currentQuantity = existing ? existing.quantity : 0;
    const newTotalQuantity = currentQuantity + Number(quantity);

    // Validar stock disponible
    if (newTotalQuantity > prod.stock) {
      throw new Error(`Stock insuficiente. Disponible: ${prod.stock}. En carrito: ${currentQuantity}`);
    }

    if (!existing) {
      cart.products.push({ product: productId, quantity });
    } else {
      existing.quantity = newTotalQuantity;
    }

    await cart.save();
    const populated = await CartModel.findById(cartId).populate("products.product").lean();
    return { ...populated, id: populated._id };
  }

  async deleteProductFromCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;
    cart.products = cart.products.filter((p) => String(p.product) !== String(productId));
    await cart.save();
    const populated = await CartModel.findById(cartId).populate("products.product").lean();
    return { ...populated, id: populated._id };
  }

  async updateCartProducts(cartId, productsArray) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;
    cart.products = productsArray.map((p) => ({ product: p.product, quantity: Number(p.quantity) || 0 }));
    await cart.save();
    const populated = await CartModel.findById(cartId).populate("products.product").lean();
    return { ...populated, id: populated._id };
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;
    const item = cart.products.find((p) => String(p.product) === String(productId));
    if (!item) return null;

    // Validar stock disponible
    const prod = await ProductModel.findById(productId).lean();
    if (!prod) return null;
    if (Number(quantity) > prod.stock) {
      throw new Error(`Stock insuficiente. Disponible: ${prod.stock}. En carrito: ${item.quantity}`);
    }
    item.quantity = Number(quantity) || 0;
    await cart.save();
    const populated = await CartModel.findById(cartId).populate("products.product").lean();
    return { ...populated, id: populated._id };
  }

  async clearCart(cartId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;
    cart.products = [];
    await cart.save();
    const populated = await CartModel.findById(cartId).populate("products.product").lean();
    return { ...populated, id: populated._id };
  }
}

export default CartManager;
