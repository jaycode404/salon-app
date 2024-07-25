import React, { useContext, useEffect, useState } from "react";
import ServicioCard from "./ServicioCard";
import { GeneralContext } from "../context/GeneralContext";
import Swal from "sweetalert2";
import { parse, isAfter } from "date-fns";
import { useNavigate } from "react-router-dom";
const initialForm = {
  fecha: "",
  hora: "",
  usuarioId: "",
};

export default function Agendar() {
  const [servicios, setServicios] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [carritoBox, setCarritoBox] = useState([]);
  let [total, setTotal] = useState(0);
  const [form, setForm] = useState(initialForm);
  const { user, loading } = useContext(GeneralContext);
  const navigate = useNavigate();
  //FORMATEAR FECHA////////////////////////////
  const formatFecha = (fecha) => {
    const [year, month, day] = fecha.split("-");
    return `${year}-${month}-${day}`;
  };
  //get cita a comparar///////////////////////////
  const getCitas = async (fecha) => {
    try {
      const response = await fetch(`http://localhost:3000/citas/${fecha}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.log("solicitud fallida");
        return [];
      }
    } catch (err) {
      console.log("fecha y hora ocupados");
      return [];
    }
  };

  //VALIDAR HORARIO///////////////////////////
  const validarHorario = async (fecha, hora) => {
    const formatedFecha = formatFecha(fecha);
    const citas = await getCitas(formatedFecha);

    const [formHoraHoras, formHoraMinutos] = hora.split(":").map(Number);
    const formHoraEnMinutos = formHoraHoras * 60 + formHoraMinutos;

    const margin = 20;
    let proximaHoraDisponible = null;

    const citasEmpalmadas = citas.filter((cita) => {
      const existingCitaDate = new Date(cita.fecha);
      const existingCitaFecha = existingCitaDate.toISOString().split("T")[0];
      const existingCitaHora = cita.hora;

      if (existingCitaFecha !== formatedFecha && !fechaValida(formatedFecha)) {
        return false;
      }

      const [existingHoraHoras, existingHoraMinutos] = existingCitaHora
        .split(":")
        .map(Number);
      const existingHoraEnMinutos =
        existingHoraHoras * 60 + existingHoraMinutos;

      const isEmpalmada =
        Math.abs(existingHoraEnMinutos - formHoraEnMinutos) < margin;

      if (isEmpalmada) {
        const proximaHora = existingHoraEnMinutos + margin;
        const horas = Math.floor(proximaHora / 60)
          .toString()
          .padStart(2, "0");
        const minutos = (proximaHora % 60).toString().padStart(2, "0");
        proximaHoraDisponible = `${horas}:${minutos}`;
      }

      return isEmpalmada;
    });

    return {
      horarioOcupado: citasEmpalmadas.length > 0,
      proximaHoraDisponible,
    };
  };

  //validar fecha//////////////////////////////
  const fechaValida = (fecha) => {
    const fechaSeleccionada = parse(fecha, "yyyy-MM-dd", new Date());
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);
    fechaSeleccionada.setHours(5, 5, 5, 5);
    if (isAfter(fechaSeleccionada, ahora)) {
      console.log("Fecha válida");
      return true;
    } else {
      console.log("Fecha no válida");
      return false;
    }
  };

  //hora valida//////////////////////////////
  const horaValida = (fecha, hora) => {
    const fechaSeleccionada = new Date(`${fecha}T${hora}:00`);
    const ahora = new Date();

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada.toDateString() === hoy.toDateString()) {
      return fechaSeleccionada >= ahora;
    }

    return true;
  };
  //handleChange//////////////////////////////
  const handleChange = async (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
      usuarioId: user.id,
    });

    if (name === "fecha") {
      const fechaValidada = fechaValida(value);
      if (fechaValidada === false) {
        Swal.fire({
          icon: "error",
          title: "Fecha no válida",
          text: "La fecha seleccionada es anterior a hoy.",
        });
        return;
      }
    }

    if (name === "hora") {
      if (form.fecha) {
        const { horarioOcupado, proximaHoraDisponible } = await validarHorario(
          form.fecha,
          value
        );
        const horaValidada = horaValida(form.fecha, value);
        if (horarioOcupado) {
          Swal.fire({
            icon: "error",
            title: "Hora no disponible",
            text: `Esta hora está ocupada, la hora más próxima disponible es ${proximaHoraDisponible}.`,
          });
        } else if (!horaValidada) {
          Swal.fire({
            icon: "error",
            title: "Selecciona una hora válida",
            text: "Esta hora es anterior a la actual...",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Hora disponible",
            text: "Esta hora está disponible!",
          });
        }
      }
    }
  };
  //handleSubmit///////////////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!carrito.length > 0) {
      Swal.fire({
        title: "Agrega al menos un servicio al carrito",
        icon: "warning",
      });
      return;
    } else if (form.fecha === "") {
      Swal.fire({
        title: "Debes seleccionar una fecha",
        icon: "warning",
      });
      return;
    } else if (form.hora === "") {
      Swal.fire({
        title: "Debes seleccionar una hora",
        icon: "warning",
      });
      return;
    }
    try {
      //POST EN CITAS/////////////////////////
      const response = await fetch("http://localhost:3000/crear-cita", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error("error al crear la cita");
      }

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cita creada correctamente!",
        showConfirmButton: false,
        timer: 1500,
      });
      const dataCita = await response.json();
      const { citaId } = dataCita;
      console.log(citaId);

      const dataCitaServicios = {
        citaId,
        servicios: carrito,
      };

      //POST EN CITASERVICIOS//////////////////
      const responseServicios = await fetch(
        "http://localhost:3000/citasservicios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataCitaServicios),
        }
      );

      if (!responseServicios.ok) {
        throw new Error("error al insertar servicios");
      }

      //errores handle
      setForm(initialForm);
      setCarrito([]);
      setCarritoBox([]);
      setTotal(0);
      setTimeout(() => {
        if (loading == false) {
          navigate("/menu");
        }
      }, 1500);
    } catch (err) {
      console.log("error en la coneccion");
    }
  };

  ///get SERVICIOS /////////////////////////////
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

  ///ADD CARRITO /////////////////////////////
  const addCarrito = (id) => {
    console.log(id);

    const servicio = servicios.find((servicio) => id === servicio.id);

    if (
      servicio &&
      !carritoBox.includes(servicio) &&
      !carrito.includes(servicio.id)
    ) {
      setCarrito([...carrito, servicio.id]);
      setCarritoBox([...carritoBox, servicio]);
      console.log(carritoBox);
      console.log(carrito);
    }
  };

  //QUITAR DE CARRITO///////////////////////////
  const quitar = (id) => {
    const newCarrito = carrito.filter((itemId) => itemId !== id);
    const newCarritoBox = carritoBox.filter((item) => item.id !== id);

    setCarrito(newCarrito);
    setCarritoBox(newCarritoBox);
    console.log(carrito);
    console.log(carritoBox);
  };

  //CALCULAR TOTAL///////////////////////////////
  useEffect(() => {
    const total = carritoBox.reduce(
      (sum, servicio) => sum + parseFloat(servicio.precio),
      0
    );
    setTotal(total);
  }, [carritoBox]);

  return (
    <section>
      <h2>Agendar Cita</h2>
      <div className="agendar-form-card">
        <div>
          <h3>Servicios</h3>
          <h4>Elije tus servicios:</h4>
          <div className="servicios-container">
            {servicios.map((servicio, i) => {
              return (
                <ServicioCard
                  key={i}
                  quitar={quitar}
                  servicio={servicio}
                  addCarrito={addCarrito}
                />
              );
            })}
          </div>
        </div>
        {/* esto se envia a la tabla de citasservicios */}
        <div className="carrito-container">
          <h3>Carrito</h3>
          <h4>total: ${total}</h4>
          {carrito.length === 0 ? (
            <i>selecciona algun servicio...</i>
          ) : (
            <p>aquí los servicios incluidos en tu cita:</p>
          )}
          <div className="carrito-box">
            {carritoBox.map((servicio, index) => {
              return (
                <ServicioCard
                  key={index}
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
          <h4>elije un dia disponible para tu cita:</h4>
          <form className="horario-form" action="" onSubmit={handleSubmit}>
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
            <button className="button button-green" type="submit">
              Agendar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
