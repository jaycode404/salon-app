import React, { useEffect, useState } from "react";
import ServicioCard from "./ServicioCard";
export default function Agendar() {
  const [servicios, setServicios] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [carritoBox, setCarritoBox] = useState(carrito);
  let [total, setTotal] = useState(0);
  useEffect(() => {
    const getServicios = async () => {
      const respuesta = await fetch("http://localhost:3000/servicios", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (respuesta.ok) {
        const data = await respuesta.json();
        setServicios(data);
      } else {
        console.log("no se encontraron servicios");
      }
    };
    getServicios();
  }, []);

  const addCarrito = (id) => {
    console.log(id);

    const servicio = servicios.find((servicio) => id === servicio.servicio_id);

    if (servicio && !carrito.includes(servicio)) {
      setCarrito([...carrito, servicio]);
      console.log(servicio);
      console.log(carrito);
    }
  };

  const quitar = (id) => {
    const newCarrito = carrito.filter((item) => item.servicio_id !== id);

    setCarrito(newCarrito);
  };

  useEffect(() => {
    const total = carrito.reduce(
      (sum, servicio) => sum + parseFloat(servicio.precio),
      0
    );
    setTotal(total);
  }, [carrito]);
  return (
    <div>
      <h2>Agendar Cita</h2>
      <div>
        <h3>Servicios</h3>
        <p>Elije tus servicios</p>
        <div className="servicios-container">
          {servicios.map((servicio) => {
            return (
              <ServicioCard
                quitar={quitar}
                servicio={servicio}
                addCarrito={addCarrito}
                key={servicio.servicio_id}
              />
            );
          })}
        </div>
      </div>
      <div>
        <h3>Carrito</h3>
        <h4>total: ${total}</h4>
        <p>aqui tus servicios incluidos en tu cita</p>
        <div className="carrito-container">
          {carrito.map((servicio) => {
            return (
              <ServicioCard
                servicio={servicio}
                addCarrito={addCarrito}
                quitar={quitar}
              />
            );
          })}
        </div>
      </div>
      <div>
        <h3>Fecha</h3>
        <p>elije un dia disponible para</p>
        <form action="">
          <div>
            <label htmlFor="Dia">Dia:</label>
            <input type="date" name="date" />
          </div>
          <div>
            <label htmlFor="hour">Hora:</label>
            <input type="time" name="time" />
          </div>
          <button type="submit">Agendar</button>
        </form>
      </div>
    </div>
  );
}
