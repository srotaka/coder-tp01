import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// Crear servidor HTTP
const httpServer = createServer(app);

// Configurar Socket.io
const io = new Server(httpServer);

// Configurar Handlebars con helpers personalizados
app.engine("handlebars", engine({
  helpers: {
    eq: (a, b) => a === b,
    lt: (a, b) => a < b,
    multiply: (a, b) => (a * b).toFixed(2),
    formatPrice: (price) => Number(price).toFixed(2),
    ifEquals: function(a, b, options) {
      if (String(a) === String(b)) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }
  }
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Hacer io accesible en las rutas
app.set("io", io);

// Conectar a MongoDB Atlas
const MONGO_URI = "mongodb+srv://admin:admin1234@coderhousecluster.uuriwsh.mongodb.net/?appName=CoderhouseCluster";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas de vistas
app.use("/", viewsRouter);

// Configurar WebSocket
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
  console.log(`Iniciando servidor en http://localhost:${PORT}`);
});
