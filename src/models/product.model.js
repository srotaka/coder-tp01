import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Catálogo de categorías
export const PRODUCT_CATEGORIES = [
  "Almacenamiento",
  "Audio",
  "Cámaras",
  "Componentes",
  "Energía",
  "Gaming",
  "Impresoras",
  "Laptops",
  "Mobiliario",
  "Monitores",
  "Periféricos",
  "Redes",
  "Smartphones",
  "Software",
  "Tablets"
];

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { 
      type: String, 
      required: true,
      enum: PRODUCT_CATEGORIES
    },
  },
  { timestamps: true }
);

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
