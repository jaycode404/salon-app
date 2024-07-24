import React, { useContext } from "react";
import { GeneralContext } from "../context/GeneralContext";
import Swal from "sweetalert2";
export default function CitaCard({ cita, formatFecha }) {
  const { cancelarCita } = useContext(GeneralContext);
  const horaFormateada = cita.hora.split(":").slice(0, 2).join(":");

  return (
    <div className="cita-card">
      <div>
        {/* <p>Cita Id: {cita.id}</p> */}
        <p>id: {cita.citaId}</p>
        <p>FECHA: {formatFecha}</p>
        <p>HORA: {horaFormateada}</p>
      </div>
      <div className="cita-servicios">
        <h4>Estos son tus servicios:</h4>
        <div>
          {cita.servicios.map((servicio) => {
            return (
              <div key={servicio.servicioId}>
                <p>{servicio.servicioNombre}</p>
                <p>${servicio.servicioPrecio}</p>
              </div>
            );
          })}
        </div>
      </div>
      <button
        onClick={() => {
          cancelarCita(cita.citaId);
        }}
      >
        cancelar cita
      </button>
    </div>
  );
}
