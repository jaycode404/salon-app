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

  const citasPorFecha = agruparCitasPorFecha(allCitas);
  return (
    <div>
      <h2>Admin Panel</h2>
      <div className="citas-container">
        {Object.keys(citasPorFecha).map((fecha) => (
          <div key={fecha} className="fecha-group">
            <h3>{fecha}</h3>
            {citasPorFecha[fecha].map((cita) => {
              console.log(cita)
              const { hora } = formatoFechaHora(cita.fecha, cita.hora);
              return (
                <div key={cita.id} className="cita-card">
                  <p>HORA: {hora}</p>
                  <p>
                    CLIENTE: {cita.nombre} {cita.apellido}
                  </p>
                  <p>Telefono: {cita.telefono}</p>
                  <button
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
        ))}
      </div>
    </div>
  );
}
