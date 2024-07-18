import React, { useContext, useEffect, useState } from "react";
import ServicioCard from "./ServicioCard";
import { GeneralContext } from "../context/GeneralContext";

const initialForm = {
  fecha: "",
  hora: "",
  usuarioId: "",
};

export default function Agendar() {
  const [servicios, setServicios] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [carritoBox, setCarritoBox] = useState(carrito);
  let [total, setTotal] = useState(0);
  const [form, setForm] = useState(initialForm);
  const { user } = useContext(GeneralContext);

  //handleChange
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
      usuarioId: user.id,
    });
    console.log(form);
    
  };

  //handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/crear-cita", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.log("error al crear la cita");
      }
    } catch (err) {
      console.log("error en la coneccion");
    }
  };

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

  //QUITAR DE CARRITO
  const quitar = (id) => {
    const newCarrito = carrito.filter((item) => item.servicio_id !== id);

    setCarrito(newCarrito);
  };

  //CALCULAR TOTAL
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
      {/* esto se envia a la tabla de citasservicios */}
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
      {/* esto se envia a la tabla de citas */}
      <div>
        <h3>Fecha</h3>
        <p>elije un dia disponible para</p>
        <form action="" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fecha">Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="hora">Hora:</label>
            <input
              value={form.hora}
              type="time"
              name="hora"
              onChange={handleChange}
            />
          </div>
          <button type="submit">Agendar</button>
        </form>
      </div>
    </div>
  );
}
