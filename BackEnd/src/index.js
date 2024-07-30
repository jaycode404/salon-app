import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import mysql from "mysql2";
import { pool } from "./db.js";
import cors from "cors";
import { ca } from "date-fns/locale";
const app = express();
import { PORT } from "./config.js";
///////////////////////////////////////////
const corsOptions = {
  origin: 'https://salon-app-mu.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization'
};
app.use(cors(corsOptions));
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

//GENERAR TOKEN ////////////////////////////
const generateToken = () => {
  return crypto.randomBytes(10).toString("hex").slice(0, 15);
};
//EMAIL CNFIG ////////////////////////////
const sendConfirmationEmail = async (userEmail, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jaycode404@gmail.com",
      pass: "hziidbvtwfrgwkbt",
    },
  });

  const mailOptions = {
    from: "jaycode404@gmail.com",
    to: userEmail,
    subject: "Confirma tu Email",
    text: `Gracias por registrarte, por favor confirma tu email haciendo click en el siguiente enlace: http://localhost:5173/confirmar-email?token=${token}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log(`correo enviado a ${userEmail}`);
  } catch (err) {
    console.log("error al eviar correo", err);
  }
};
//CONFIRMAR EMAIL ////////////////////////////
app.get("/confirmar-email", async (req, res) => {
  const { token } = req.query;

  try {
    const [result] = await pool.query(
      `SELECT * FROM usuarios WHERE token = ?`,
      [token]
    );

    if (result.length > 0) {
      const user = result[0];
      await pool.query(`UPDATE usuarios SET confirmado = 1`, [user.id]);
      res.status(200).json({ message: "Email confirmado!" });
      await pool.query(`UPDATE usuarios SET token = NULL WHERE id = ?`, [
        user.id,
      ]);
    }
    // } else {
    //   res.status(404).json({ message: "token no valido" });
    // }
  } catch (err) {
    res.status(500).json({ message: "error en la coneccion" });
  }
});
//CREATE USER ////////////////////////////
app.post("/crear-cuenta", async (req, res) => {
  const { nombre, apellido, email, password, telefono } = req.body;

  try {
    const [existingUser] = await pool.query(
      `SELECT * FROM usuarios WHERE email = ?`,
      [email]
    );

    if (existingUser.length > 0) {
      // return console.log(existingUser)
      return res
        .status(400)
        .json({ message: "Este mail ya esta registrado, inicia sesión" });
    }

    const token = generateToken();
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO usuarios (nombre, apellido, email, password, telefono, confirmado, token) VALUES (?, ?, ?, ?, ?, 0, ?)",
      [nombre, apellido, email, hashedPassword, telefono, token]
    );
    await sendConfirmationEmail(email, token);
    res.status(200).json({
      message:
        "Gracias por registrarte, revisa tu email para confirmarlo y luego inicia sesion, por favor",
      result,
    });
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
    if (user.confirmado === 0) {
      return res.status(403).json({
        message: "Por favor confirma tu email antes de iniciar sesion",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
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

      res.json({ accessToken, refreshToken, user });
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

//admin citas ////////////////////////////
app.get("/admin", async (req, res) => {
  try {
    const [result] = await pool.query(`
         SELECT
          citas.id AS citaId,
          citas.fecha,
          citas.hora,
          usuarios.nombre,
          usuarios.apellido,
          usuarios.telefono,
          servicios.id AS servicioId,
          servicios.nombre AS servicioNombre,
          servicios.precio AS servicioPrecio
          FROM citas
          INNER JOIN usuarios ON citas.usuarioId = usuarios.id 
          INNER JOIN citasservicios ON citas.id = citasservicios.citaId
          INNER JOIN servicios ON citasservicios.servicioId = servicios.id
      `);

    const citasMap = {};
    result.forEach((row) => {
      if (!citasMap[row.citaId]) {
        citasMap[row.citaId] = {
          id: row.citaId,
          fecha: row.fecha,
          hora: row.hora,
          nombre: row.nombre,
          apellido: row.apellido,
          telefono: row.telefono,
          servicios: [],
        };
      }

      citasMap[row.citaId].servicios.push({
        id: row.servicioId,
        nombre: row.servicioNombre,
        precio: row.servicioPrecio,
      });
    });
    const citas = Object.values(citasMap);
    res.status(200).json(citas);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});
//MENU ////////////////////////////
app.post("/menu", async (req, res) => {
  try {
    const { usuarioId } = req.body;
    const [result] = await pool.query(
      `SELECT 
        c.id AS citaId,
        c.fecha,
        c.hora,
        s.id AS servicioId,
        s.nombre AS servicioNombre,
        s.precio AS servicioPrecio
        FROM 
        citas c 
      INNER JOIN 
        citasservicios cs ON c.id = cs.citaId
      INNER JOIN
        servicios s ON cs.servicioId = s.id
      WHERE 
        c.usuarioId = ?`,
      [usuarioId]
    );

    const citas = result.reduce((acc, row) => {
      const citaIndex = acc.findIndex((cita) => cita.citaId === row.citaId);
      const servicio = {
        servicioId: row.servicioId,
        servicioNombre: row.servicioNombre,
        servicioPrecio: row.servicioPrecio,
      };

      if (citaIndex === -1) {
        acc.push({
          citaId: row.citaId,
          fecha: row.fecha,
          hora: row.hora,
          servicios: [servicio],
        });
      } else {
        acc[citaIndex].servicios.push(servicio);
      }
      return acc;
    }, []);

    res.status(200).send(citas);
  } catch (err) {
    res.status(500).send({ message: "error en la coneccion" });
  }
});
//HORARIO DISPONIBLE////////////////////////////
app.get("/citas/:fecha", async (req, res) => {
  try {
    const { fecha } = req.params;
    const [result] = await pool.query(`SELECT * FROM citas WHERE fecha = ?`, [
      fecha,
    ]);
    res.status(200).json(result);
    // console.log(result);
  } catch (err) {
    res.status(500).json({ message: "error en la coneccion" });
  }
});

//SERVICIOS////////////////////////////
app.get("/servicios", async (req, res) => {
  try {
    const [servicios] = await pool.query(`SELECT * FROM servicios`);
    res.status(200).json(servicios);
  } catch (err) {
    res.status(500).json({ message: "error al obtener los servicios" });
  }
});

//CREAR-CITA////////////////////////////
app.post("/crear-cita", async (req, res) => {
  try {
    const { fecha, hora, usuarioId } = req.body;
    const [result] = await pool.query(
      `INSERT INTO citas(fecha, hora, usuarioId) VALUES (?,?,?)`,
      [fecha, hora, usuarioId]
    );
    const citaId = await result.insertId;
    // console.log(result);
    res.status(200).json({ citaId });
  } catch (err) {
    res.status(400).send({ message: "error en la coneccion" });
  }
});
//CREAR SERVICIOS////////////////////////
app.post("/citasservicios", async (req, res) => {
  try {
    const { citaId, servicios } = req.body;
    const insertPromises = servicios.map((servicio) => {
      return pool.query(
        `INSERT INTO citasservicios(citaId, servicioId) VALUES (?,?)`,
        [citaId, servicio]
      );
    });
    await Promise.all(insertPromises);
    res.status(201).json({ message: "servicios insertados correctamente" });
  } catch (err) {
    console.log("error al insertar servicios", err);
  }
});

//CANCELAR CITA //////////////////////////////
app.delete("/eliminar-cita/:id", async (req, res) => {
  try {
    const citaId = req.params.id;
    const [result] = await pool.query(`DELETE FROM citas WHERE id = ?`, [
      citaId,
    ]);
    if (result.affectedRows > 0) {
      res.status(200).send({ message: "cita eliminada" });
    } else {
      res.status(400).send({ message: "no se elimino la cita" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error al eliminar la cita" });
  }
});
//LISTEN/////////////////////////////
app.listen(PORT, () => {
  // console.log(`escuchando  en el puerto ${port}`);
  console.log(`conectado...`, PORT);
});
