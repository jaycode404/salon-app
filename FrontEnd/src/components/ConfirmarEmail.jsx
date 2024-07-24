import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

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
        setMessage(data.message);
      } else {
        setMessage(data.message || "Error al confirmar email");
      }
    } catch (err) {}
    setMessage("Error al conectar al servidor");
  };
  useEffect(() => {
    confirmarEmail();
  }, []);
  return <div></div>;
}
