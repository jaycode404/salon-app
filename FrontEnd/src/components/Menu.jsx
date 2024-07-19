import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";
import Swal from "sweetalert2";
export default function Menu() {
  const [citas, setCitas] = useState([]);
  const { user, loading } = useContext(GeneralContext);
  const navigate = useNavigate();

  useEffect(() => {
    const getCitas = async () => {
      if (loading) return;
      try {
        const res = await fetch("http://localhost:3000/menu", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usuarioId: user.id }),
        });

        if (res.ok) {
          const data = await res.json();
          setCitas(data);
          // console.log(citas);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "no se encontraron citas!",
          });
          console.log("citas vacio");
        }
      } catch (err) {
        console.log(err, "error en la coneccion");
      }
    };
    getCitas();
  }, [loading, user.id]);

  return (
    <div>
      <h2>Menú</h2>
      {!loading ? <i>USUARIO: {user.nombre}</i> : <i>Cargando usuario...</i>}

      <h2>
        {" "}
        {citas.length > 0 ? "Estas son tus citas" : "No tienes citas..."}
      </h2>
      <div className="citas-container">
        {citas.map((cita) => {
          return (
            <div className="cita-card" key={cita.citaId}>
              <div>
                {/* <p>Cita Id: {cita.id}</p> */}
                <p>FECHA: {cita.fecha}</p>
                <p>HORA: {cita.hora}</p>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
