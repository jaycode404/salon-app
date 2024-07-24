import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import confetti from "canvas-confetti";
export default function ConfirmarEmail() {
  const [message, setMessage] = useState("");
  const location = useLocation();

  const confirmarEmail = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (!token) {
      setMessage("Link de confirmacion Invalido");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/confirmar-email?token=${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Inicia sesion");
        showConfetti();
      } else {
        setMessage(data.message || "Error al confirmar email");
      }
    } catch (err) {
      setMessage("Error al conectar al servidor");
    }
  };
  const showConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { x: 0, y: 1 },
      angle: 45,
      gravity: 1,
    });
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { x: 1, y: 1 },
      angle: 135,
      gravity: 1,
    });
  };
  useEffect(() => {
    confirmarEmail();
  }, []);
  return (
    <div>
      <h1>{message}</h1>
      <Link to="/login">Iniciar sesion</Link>
    </div>
  );
}
