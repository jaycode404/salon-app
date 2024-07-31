import React, { useContext, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { GeneralContext } from "../context/GeneralContext";
export default function ConfirmarEmail() {
  const [message, setMessage] = useState("");
  const location = useLocation();
  const { dbUrl, confirmarEmail } = useContext(GeneralContext);

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
    <section>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: ".5rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1
          className={`confirm-message ${
            message ? "user-nombre" : "red-gradient"
          }`}
        >
          {message ? message : "error en el token"}
        </h1>
        <Link to="/login" className="button button-blue">
          Iniciar sesion
        </Link>
      </div>
    </section>
  );
}
