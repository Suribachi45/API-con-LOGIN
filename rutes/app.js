const express = require("express");
const axios = require("axios");
const session = require("express-session");
const { verifyToken } = require("./middlewares/middlewares");

const PORT = 3000;
const app = express();

// Configuración de sesiones con mayor seguridad
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Clave secreta desde variable de entorno
    resave: false,
    saveUninitialized: false, // Solo guarda sesiones iniciadas
    cookie: { secure: true } // Forzar HTTPS
  })
);

// Middleware de verificación de token (antes de procesar datos)
app.use(verifyToken);

// Middleware para analizar JSON
app.use(express.json());

// Rutas
const routes = require("./routes/routes");
app.use("/", routes);

// Manejo de errores en verifyToken 
verifyToken.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Error al verificar el token" });
});

app.listen(PORT, () => {
  console.log(`Escuchando en el puerto http://localhost:${PORT}`);
});