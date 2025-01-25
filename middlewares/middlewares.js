
const jwt = require("jsonwebtoken");
const users = require("../users/users");

// Función para generar un token JWT 
function generateToken(userId) {
  const payload = { userId }; 
  const secret = process.env.JWT_SECRET; 


  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

// Middleware de verificación de token 
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Falta encabezado de autorización o formato inválido" });
  }

  const token = authHeader.split(" ")[1]; // Extraer token del encabezado Bearer

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Manejar errores específicos 
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expirado" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Formato de token inválido" });
      } else {
        // Manejar otros errores de forma más genérica
        return res.status(401).json({ message: "No autorizado", error: err.message });
      }
    }

    req.user = decoded.userId; 
    next();
  });
}

module.exports = {
  generateToken,
  verifyToken,
};