import fs from "fs/promises";

class CartManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      // Si no existe el archivo, devolvemos un array vacío
      if (error) {
        await this.writeFile([]);
        return [];
      }
      throw error;
    }
  }

  async writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2), "utf-8");
  }

  // Crear un nuevo carrito
  async createCart() {
    const carts = await this.readFile();

    const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

    const newCart = {
      id: newId,
      products: [],
    };

    carts.push(newCart);
    await this.writeFile(carts);

    return newCart;
  }

  // Obtener un carrito por ID
  async getCartById(id) {
    const carts = await this.readFile();
    return carts.find((c) => String(c.id) === String(id)) || null;
  }

  // Agregar un producto al carrito
  async addProductToCart(cartId, productId, quantity = 1) {
    const carts = await this.readFile();
    const cartIndex = carts.findIndex((c) => String(c.id) === String(cartId));

    if (cartIndex === -1) return null;

    const cart = carts[cartIndex];

    const existingProductIndex = cart.products.findIndex(
      (p) => String(p.product) === String(productId)
    );

    if (existingProductIndex === -1) {
      cart.products.push({
        product: productId,
        quantity,
      });
    } else {
      cart.products[existingProductIndex].quantity += quantity;
    }

    carts[cartIndex] = cart;
    await this.writeFile(carts);

    return cart;
  }
}

export default CartManager;
