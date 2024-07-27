import React, { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../context/GeneralContext";

export default function AdminPanel() {
  const { cancelarCita, allCitas, setAllCitas, getAllCitas } =
    useContext(GeneralContext);
  const formatoFechaHora = (fechaISO, hora) => {
    const opcionesFecha = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const opcionesHora = { hour: "2-digit", minute: "2-digit" };

    const fecha = new Date(fechaISO);
    const fechaFormateada = fecha.toLocaleDateString("es-ES", opcionesFecha);

    const horaFormateada = hora.split(":").slice(0, 2).join(":");

    return {
      fecha: fechaFormateada,
      hora: horaFormateada,
    };
  };

  useEffect(() => {
    getAllCitas();
  }, []);

  const agruparCitasPorFecha = (citas) => {
    const citasPorFecha = {};
    citas.forEach((cita) => {
      const { fecha } = formatoFechaHora(cita.fecha, cita.hora);
      if (!citasPorFecha[fecha]) {
        citasPorFecha[fecha] = [];
      }
      citasPorFecha[fecha].push(cita);
    });
    return citasPorFecha;
  };

  const calcularTotalServicios = (servicios) => {
    return servicios.reduce((total, servicio) => total + parseInt(servicio.precio), 0);
  };
  const citasPorFecha = agruparCitasPorFecha(allCitas);
  return (
    <section>
      <h2>Admin Panel</h2>
      <div className="admin-citas-container">
        {Object.keys(citasPorFecha).map((fecha, i) => (
          <div key={i} className="fecha-group">
            <h3>{fecha}</h3>

            <div className="fecha-group-container">
              {citasPorFecha[fecha].map((cita) => {
                console.log(cita.servicios);

                const { hora } = formatoFechaHora(cita.fecha, cita.hora);
                const totalServicios = calcularTotalServicios(
                  cita.servicios || []
                );
                return (
                  <div key={cita.id} className="admin-cita-card">
                    <p>
                      HORA: <span>{hora}</span>
                    </p>
                    <p>
                      CLIENTE:{" "}
                      <span>
                        {cita.nombre} {cita.apellido}
                      </span>
                    </p>
                    <p>
                      Telefono: <span>{cita.telefono}</span>
                    </p>
                    <p>TOTAL: <span className="precio">${totalServicios}</span></p>
                    <button
                      className="button button-red"
                      onClick={() => {
                        cancelarCita(cita.id);
                      }}
                    >
                      Cancelar Cita
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
