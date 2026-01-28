# 🛒 E-Commerce Backend - Proyecto Final

*Curso:* Programación Backend I: Desarrollo Avanzado de Backend  
*Comisión:* 81170    
*Institución:* Coderhouse  
*Alumna:* Silvia R. Otaka

---

## 📝 Descripción

Proyecto final del curso de Backend I que implementa un sistema completo de e-commerce con Node.js, Express, MongoDB y WebSockets. La aplicación permite gestionar productos y carritos de compra con una interfaz web y actualización en tiempo real.

---

## ✨ Funcionalidades Principales

### Gestión de Productos
- ✅ Listar productos con paginación
- ✅ Filtrado por categoría y disponibilidad
- ✅ Ordenamiento por precio (ascendente/descendente)
- ✅ Vista detallada de cada producto
- ✅ Crear, editar y eliminar productos
- ✅ Actualización en tiempo real con WebSockets

### Sistema de Carrito
- ✅ Gestionar carritos de compra
- ✅ Agregar/eliminar productos del carrito
- ✅ Actualizar cantidades de productos
- ✅ Cálculo automático de totales
- ✅ Vista completa del carrito con sus productos

### Interfaz de Usuario
- ✅ Diseño responsive con Bootstrap 5
- ✅ Notificaciones de acciones del usuario

---

## 🌐 Endpoints de la API

### Productos (`/api/products`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Listar productos con filtros y paginación |
| GET | `/api/products/:id` | Obtener un producto por ID |
| POST | `/api/products` | Crear un nuevo producto |
| DELETE | `/api/products/:id` | Eliminar un producto |

**Query params para GET:**
- `limit`: Cantidad de productos por página (default: 10)
- `page`: Número de página (default: 1)
- `sort`: Ordenar por precio (`asc` o `desc`)
- `query`: Filtrar por categoría o `available` para disponibles

### Carritos (`/api/carts`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/carts/:cid` | Obtener un carrito por ID |
| POST | `/api/carts/:cid/product` | Agregar producto al carrito |
| PUT | `/api/carts/:cid/products/:pid` | Actualizar cantidad de un producto del carrito|
| DELETE | `/api/carts/:cid/products/:pid` | Eliminar un producto del carrito |
| DELETE | `/api/carts/:cid` | Vaciar el carrito completo |

---

## 🖥️ Vistas del Proyecto

| Ruta | Descripción |
|------|-------------|
| `/` | Redirecciona a la lista de productos |
| `/products` | Lista de productos con paginación y filtros |
| `/products/:pid` | Detalle completo de un producto |
| `/carts/:cid` | Vista del carrito con sus productos |
| `/realtimeproducts` | Gestión de productos en tiempo real |

---

## 🛠️ Tecnologías Utilizadas

- **Backend:**
  - Node.js
  - Express.js
  - Mongoose
  
- **Base de Datos:**
  - MongoDB Atlas
  
- **Frontend:**
  - Handlebars
  - Bootstrap 5
  - Socket.io Client (WebSockets)
  
---

## 🎯 Requisitos 

Este proyecto cumple con todos los requisitos de la entrega final del curso:

- ✅ MongoDB como sistema de persistencia principal
- ✅ Consultas de productos con filtros, paginación y ordenamiento
- ✅ Formato de respuesta estructurado con `status`, `payload`, `prevLink`, `nextLink`
- ✅ Búsqueda por categoría y disponibilidad
- ✅ Ordenamiento ascendente/descendente por precio
- ✅ Endpoints completos para gestión de carrito
- ✅ Referencias de productos en carritos con `populate`
- ✅ Vista `/products` con paginación
- ✅ Vista `/products/:pid` con detalle y botón de agregar al carrito
- ✅ Vista `/carts/:cid` para visualizar carritos específicos

---

## 👩‍💻 Características Adicionales

Más allá de los requisitos, el proyecto incluye:

- 🎨 Interfaz responsive
- 📊 Categorías de productos predefinidas
- 🔔 Sistema de notificaciones para el usuario
- 🎨 Badges visuales de stock
- ⚡ Validaciones en todos los endpoints

---

## 🚧 Mejoras Futuras y Funcionalidades Pendientes

Este proyecto cumple con los objetivos del curso Backend I, pero **no representa un e-commerce completo**. A continuación se detallan funcionalidades que podrían desarrollarse para completar el flujo de compra y mejorar la experiencia del usuario:

### 🔐 Sistema de Autenticación y Usuarios
- Registro e inicio de sesión de usuarios
- Autenticación con JWT o sesiones
- Autenticación de dos factores (2FA) con códigos por email/SMS
- Single Sign-On (SSO) con Google, Facebook, Microsoft
- Roles de usuario (cliente, administrador, superadmin)
- Perfil de usuario con datos personales
- Gestión de direcciones de envío
- Historial de compras
- Sistema de favoritos/productos marcados

### 🛍️ Gestión de Carritos
- Asociar carrito automáticamente al usuario logueado
- Persistencia del carrito entre sesiones
- Carrito guest (para usuarios no registrados)

### 💳 Proceso de Checkout
- Formulario de datos de envío
- Selección de método de pago
- Integración con pasarelas de pago
- Confirmación de orden de compra
- Generación de número de pedido
- Validación de stock antes de finalizar compra
- Cálculo de costos de envío

### 📦 Gestión de Pedidos
- Vista de pedidos realizados por el usuario
- Estado del pedido (pendiente, procesando, enviado, entregado)
- Tracking de envío
- Historial completo de compras
- Opción de cancelar pedido (según estado)
- Facturación y comprobantes

### 🖼️ Mejoras en Productos
- Imágenes de productos (upload y almacenamiento)
- Galería de imágenes por producto
- Sistema de valoraciones y reseñas
- Productos relacionados o recomendados
- Lista de deseos (wishlist)
- Notificación cuando producto sin stock esté disponible
- Protección de rutas de gestión de productos

### 📧 Comunicación y Soporte
- Página de contacto con formulario
- Envío de emails de confirmación de compra
- Notificaciones por email (pedido enviado, entregado, etc.)
- Chatbot en vivo
- Sección de preguntas frecuentes (FAQ)

### 📊 Panel de Administración
- Dashboard con estadísticas de ventas
- Gestión completa de productos
- Gestión de usuarios y permisos
- Gestión de pedidos y estados
- Reportes de inventario
- Análisis de productos más vendidos

### 🔍 Búsqueda y Filtros Avanzados
- Buscador con autocompletado
- Filtros combinados (precio, marca, características)
- Ordenamiento por popularidad y relevancia
- Filtros por rango de precios

### 🎨 Experiencia de Usuario
- Página home landing atractiva con banners, ofertas destacadas
- Carrusel de productos destacados y novedades
- Secciones de categorías populares
- Animaciones y transiciones suaves
- Diseño UX/UI profesional y moderno

### 📝 Sistema de Logs y Monitoreo
- Logs de errores, advertencias e información
- Tracking de acciones de usuarios (auditoría)
- Monitoreo de rendimiento y métricas
- Alertas automáticas por errores críticos
- Dashboard de logs y análisis

### 🔒 Seguridad Avanzada
- Variables de entorno para credenciales
- Cifrado de datos sensibles

---

## ⚠️ Alcance del Proyecto Actual

**Este proyecto cubre:**
- ✅ Backend funcional con API REST completa
- ✅ Base de datos MongoDB con modelos relacionados
- ✅ Sistema básico de productos y carritos
- ✅ Interfaz web responsive
- ✅ Actualización en tiempo real con WebSockets

**Lo que NO incluye actualmente:**
- ❌ Sistema de autenticación de usuarios
- ❌ Proceso de checkout y pagos
- ❌ Gestión de pedidos y envíos
- ❌ Sistema de usuarios con roles
- ❌ Panel de administración completo
- ❌ Integración con pasarelas de pago

---

Este proyecto fue desarrollado con fines educativos como parte del curso *Programación Backend I* de Coderhouse.

---

⭐ **Proyecto Final ● Programación Backend I ● Coderhouse ● 2026**
