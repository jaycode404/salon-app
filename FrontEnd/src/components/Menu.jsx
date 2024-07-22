import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";
import Swal from "sweetalert2";
export default function Menu() {
  const [citas, setCitas] = useState([]);
  const { user, loading } = useContext(GeneralContext);
  const navigate = useNavigate();
  //GET CITAS////////////////////////////////////
  const getCitas = async () => {
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
  useEffect(() => {
    getCitas();
  }, [loading, user.id]);

  //CANCELAR CITA//////////////////////////////
  const cancelarCita = async (id) => {
    Swal.fire({
      title: "¿Desea cancelar su cita?",
      showDenyButton: true,
      denyButtonColor: "#17d036",
      confirmButtonText: "Sí, cancelar mi cita",
      confirmButtonColor: "#e91f64",
      denyButtonText: `NO`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:3000/eliminar-cita/${id}`,
            {
              method: "DELETE",
            }
          );
          if (response.ok) {
            Swal.fire({
              title: "Cita cancelada!",
              icon: "success",
              timer: 1500,
            });
            console.log("cita cancelada");
            getCitas();
          }
        } catch (err) {
          Swal.fire({
            title: "no se pudo cancelar la cita",
            text: "Intente de nuevo más tarde",
            icon: "error",
            timer: 1500,
          });
          console.log(err);
        }
      } else if (result.isDenied) {
        console.log("la cita no fue cancelada");
      }
    });
  };

  return (
    <div>
      <h2>Menú</h2>
      {!loading ? <i>Bienvenido: {user.nombre}</i> : <i>Cargando usuario...</i>}

      <h2>
        {" "}
        {citas.length > 0 ? "Estas son tus citas" : "No tienes citas..."}
      </h2>
      <div className="citas-container">
        {citas.map((cita) => {
          const fecha = new Date(cita.fecha).toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          const formatFecha = fecha.charAt(0).toUpperCase() + fecha.slice(1);

          return (
            <div className="cita-card" key={cita.citaId}>
              <div>
                {/* <p>Cita Id: {cita.id}</p> */}
                <p>id: {cita.citaId}</p>
                <p>FECHA: {formatFecha}</p>
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
              <button
                onClick={() => {
                  cancelarCita(cita.citaId);
                }}
              >
                cancelar cita
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
