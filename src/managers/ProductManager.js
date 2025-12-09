import fs from "fs/promises";

class ProductManager {
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

  // Obtener todos los productos
  async getProducts() {
    return await this.readFile();
  }

  // Obtener un producto por ID
  async getProductById(id) {
    const products = await this.readFile();
    return products.find((p) => String(p.id) === String(id)) || null;
  }

  // Agregar un nuevo producto
  async addProduct(productData) {
    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails = [],
    } = productData;

    if (
      !title ||
      !description ||
      !code ||
      price == null ||
      stock == null ||
      !category
    ) {
      throw new Error("Faltan campos obligatorios");
    }

    const products = await this.readFile();

    // Validar código único
    const codeExists = products.some((p) => p.code === code);
    if (codeExists) {
      throw new Error("El código de producto ya existe");
    }

    const newId =
      products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const newProduct = {
      id: newId,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    products.push(newProduct);
    await this.writeFile(products);

    return newProduct;
  }

  // Actualizar un producto por ID
  async updateProduct(id, updates) {
    const products = await this.readFile();
    const index = products.findIndex((p) => String(p.id) === String(id));

    if (index === -1) {
      return null;
    }

    // No permitir cambiar id
    const { id: _, ...restUpdates } = updates;

    products[index] = {
      ...products[index],
      ...restUpdates,
    };

    await this.writeFile(products);

    return products[index];
  }

  // Eliminar un producto por ID
  async deleteProduct(id) {
    const products = await this.readFile();
    const index = products.findIndex((p) => String(p.id) === String(id));

    if (index === -1) {
      return false;
    }

    products.splice(index, 1);
    await this.writeFile(products);
    return true;
  }
}

export default ProductManager;
