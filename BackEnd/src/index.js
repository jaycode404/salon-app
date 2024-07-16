import express from "express";
import jwt from "jsonwebtoken";
import mysql from "mysql2";
import { pool } from "./db.js";
import bcryipt from "bcrypt";
import cors from "cors";
const app = express();
const port = 3000;
///////////////////////////////////////////
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

//KEYS//////////////////////////////////
const SECRET_KEY = "shinji01asuka02rei00kaworu13misato08";
const REFRESH_SECRET_KEY = "gendo01misato02ryoji03ritsuko04kaji05";

//MIDDLEWARE ////////////////////////////
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "TOKEN INVALIDO" });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "NO AUTORIZADO" });
  }
};

app.get("/", async (req, res) => {});

//CREATE USER ////////////////////////////
app.post("/create", async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, password]
    );
    res.status(201).json({ message: "registro exitoso", result });
  } catch (err) {
    res.status(404).json({ message: "Error en el servidor", err });
  }
});

//LOGIN ////////////////////////////
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
    email,
  ]);

  if (rows.length > 0) {
    const user = rows[0];
    // const isMatch = await bcryipt.compare(password, user.password);
    if (user.password === password) {
      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: "1hr" }
      );
      const refreshToken = jwt.sign(
        { id: user.id, email: user.email },
        REFRESH_SECRET_KEY,
        { expiresIn: "7d" }
      );

      res.json({ accessToken, refreshToken });
    } else {
      res.status(404).json({ message: "datos incorrectos" });
    }
  } else {
    res.status(404).json({ message: "Usuario no encontrado" });
  }
});
//LOGOUT////////////////////
app.post("/logout", (req, res) => {
  res.json({ message: "Sesion, cerrada" });
});
//REFRESHTOKEN//////////////////
app.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(403).json({ message: "refresh token no proporcionados" });
  }

  try {
    const user = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "refresh token invalido" });
  }
});

//MENU ////////////////////////////
app.get("/menu", authenticateJWT, async (req, res) => {
  const [result] = await pool.query(`SELECT * FROM usuarios`);
  res.send(result);
  console.log(result);
});

//LISTEN////////////////////////////
app.listen(port, () => {
  console.log(`escuchando  en el puerto ${port}`);
});
