import React, { useEffect, useRef, useState } from "react";

export default function ServicioCard({ servicio, addCarrito, quitar }) {
  const [parentCarrito, setParentCarrito] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const parentElem = cardRef.current?.parentElement;
    if (parentElem && parentElem.classList.contains("carrito-box")) {
      setParentCarrito(true);
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="servicio-card ticket"
      onClick={() => {
        addCarrito(servicio.id);
      }}
    >
      <div>
        <p>{servicio.nombre || servicio.servicioNombre}</p>
        <p>${servicio.precio || servicio.servicioPrecio}</p>
      </div>
      {parentCarrito && (
        <div>
          <button className="button button-red"
            onClick={() => {
              quitar(servicio.id);
            }}
          >
            Quitar
          </button>
        </div>
      )}
    </div>
  );
}
