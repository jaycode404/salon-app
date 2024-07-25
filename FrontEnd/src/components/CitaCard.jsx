import React, { useContext } from "react";
import { GeneralContext } from "../context/GeneralContext";
import Swal from "sweetalert2";
export default function CitaCard({ cita, formatFecha }) {
  const { cancelarCita } = useContext(GeneralContext);
  const horaFormateada = cita.hora.split(":").slice(0, 2).join(":");

  return (
    <div className="cita-card">
      <div className="cita-container">
        <div className="cita-datos">
          <h4>Datos tu Cita:</h4>
          {/* <p>Cita Id: {cita.id}</p> */}
          <p>
            Cita Id: <span className="cita-dato">{cita.citaId}</span>
          </p>
          <p>
            Fecha: <span>{formatFecha}</span>
          </p>
          <p>
            Hora: <span>{horaFormateada}</span>
          </p>
        </div>
        <div>
          <h4>Estos son tus servicios:</h4>
          <div className="cita-servicios">
            {cita.servicios.map((servicio) => {
              return (
                <div className="ticket" key={servicio.servicioId}>
                  <p className="servicio-nombre">{servicio.servicioNombre}</p>
                  <p className="precio">${servicio.servicioPrecio}</p>
                </div>
              );
            })}
          </div>
        </div>
       
      </div>
      <button
          className="button button-red"
          onClick={() => {
            cancelarCita(cita.citaId);
          }}
        >
          cancelar cita
        </button>
    </div>
  );
}
