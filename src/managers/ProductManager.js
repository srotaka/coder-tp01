import ProductModel, { PRODUCT_CATEGORIES } from "../models/product.model.js";

class ProductManager {
  constructor() {}

  getCategories() {
    return PRODUCT_CATEGORIES;
  }

  async getProducts(options = {}) {
    const { limit = 10, page = 1, sort, query } = options;

    const filter = {};
    if (query) {
      if (query === "available") {
        filter.status = true;
        filter.stock = { $gt: 0 };
      } else {
        filter.category = query;
      }
    }

    let sortOption = {};
    if (sort === "asc") sortOption = { price: 1 };
    else if (sort === "desc") sortOption = { price: -1 };

    const opts = { page: Number(page) || 1, limit: Number(limit) || 10, lean: true };
    if (Object.keys(sortOption).length) opts.sort = sortOption;

    const result = await ProductModel.paginate(filter, opts);
    result.docs = result.docs.map((d) => ({ ...d, id: d._id }));
    return result;
  }

  async getProductById(id) {
    const doc = await ProductModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id };
  }

  async addProduct(productData) {
    const { title, description, price, status = true, stock, category } = productData;
    if (!title || !description || price == null || stock == null || !category) {
      throw new Error("Faltan campos obligatorios");
    }

    const created = await ProductModel.create({ title, description, price, status, stock, category });
    const obj = created.toObject();
    obj.id = obj._id;
    return obj;
  }

  async updateProduct(id, updates) {
    const { id: _, ...rest } = updates;
    const updated = await ProductModel.findByIdAndUpdate(id, rest, { new: true }).lean();
    if (!updated) return null;
    return { ...updated, id: updated._id };
  }

  async deleteProduct(id) {
    const deleted = await ProductModel.findByIdAndDelete(id).lean();
    return !!deleted;
  }
}

export default ProductManager;
