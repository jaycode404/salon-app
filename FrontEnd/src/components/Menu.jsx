import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";
import Swal from "sweetalert2";
import CitaCard from "./CitaCard";
export default function Menu() {
  const { user, loading, cancelarCita, getCitas, citas, setCitas } =
    useContext(GeneralContext);
  const navigate = useNavigate();
  //GET CITAS////////////////////////////////////

  useEffect(() => {
    getCitas();
  }, [loading, user.id]);

  return (
    <section>
      <h2>Menú</h2>
      <div className="lamp-bg"></div>
      <div className="user-badge">
        <h4>Bienvenido:</h4>
        {!loading ? (
          <p className="user-nombre">{user.nombre}</p>
        ) : (
          <p>Cargando usuario...</p>
        )}
      </div>
      <h3>
        {" "}
        {citas.length > 0 ? (
          "Estas son tus citas:"
        ) : (
          <div>
            <p>No tienes citas...</p>
            <Link className="button button-blue" to={"/agendar-cita"}>
              Agendar Cita
            </Link>
          </div>
        )}
      </h3>

      <div className="citas-container">
        {citas.map((cita, i) => {
          const fecha = new Date(cita.fecha).toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          const formatFecha = fecha.charAt(0).toUpperCase() + fecha.slice(1);

          return <CitaCard key={i} cita={cita} formatFecha={formatFecha} />;
        })}
      </div>
    </section>
  );
}
