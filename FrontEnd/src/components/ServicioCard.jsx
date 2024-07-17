import React, { useEffect, useRef, useState } from "react";

export default function ServicioCard({ servicio, addCarrito, quitar }) {
  const [parentCarrito, setParentCarrito] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const parentElem = cardRef.current?.parentElement;
    if (parentElem && parentElem.classList.contains("carrito-container")) {
      setParentCarrito(true);
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="servicio-card"
      onClick={() => {
        addCarrito(servicio.servicio_id);
      }}
    >
      <p>{servicio.servicio_id}</p>
      <p>{servicio.nombre}</p>
      <p>${servicio.precio}</p>

      {parentCarrito && (
        <div>
          <button onClick={() => {quitar(servicio.servicio_id)}}>Quitar</button>
        </div>
      )}
    </div>
  );
}
