import React, { useEffect, useState } from "react";

export default function AdminPanel() {
  const [allCitas, setAllCitas] = useState([]);

  const formatoFechaHora = (fechaISO, hora) => {
    const opcionesFecha = { year: "numeric", month: "long", day: "numeric" };
    const opcionesHora = { hour: "2-digit", minute: "2-digit" };

    const fecha = new Date(fechaISO);
    const fechaFormateada = fecha.toLocaleDateString("es-ES", opcionesFecha);

    const horaFormateada = hora.split(":").slice(0, 2).join(":");

    return {
      fecha: fechaFormateada,
      hora: horaFormateada,
    };
  };

  // GET ALL CITAS ////////////////////////////
  const getAllCitas = async () => {
    console.log("trayendo todas las citas");

    try {
      const response = await fetch("http://localhost:3000/admin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        // Ordenar citas por fecha y luego por hora
        const citasOrdenadas = data
          .map((cita) => {
            // Verificar el formato de fecha y hora
            if (!cita.fecha || !cita.hora) {
              console.error("Fecha o hora inválida:", cita.fecha, cita.hora);
              return null;
            }
            return cita;
          })
          .filter((cita) => cita !== null) // Filtrar citas inválidas
          .sort((a, b) => {
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);
            if (fechaA.getTime() !== fechaB.getTime()) return fechaA - fechaB;
            return (
              new Date(`1970-01-01T${a.hora}`) -
              new Date(`1970-01-01T${b.hora}`)
            );
          });

        setAllCitas(citasOrdenadas);
        console.log(citasOrdenadas);
      } else {
        console.log("no se encontraron citas");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllCitas();
  }, []);

  return (
    <div>
      <h2>Admin Panel</h2>
      {allCitas.map((cita) => {
        const { fecha, hora } = formatoFechaHora(cita.fecha, cita.hora);
        return (
          <div key={cita.id}>
            <p>{fecha}</p>
            <p>{hora}</p>
            <p>{cita.usuarioId}</p>
          </div>
        );
      })}
    </div>
  );
}
