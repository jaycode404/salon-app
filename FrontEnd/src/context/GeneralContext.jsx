import React, { createContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
const GeneralContext = createContext();

const GeneralProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [citas, setCitas] = useState([]);
  const [allCitas, setAllCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const dbUrl = import.meta.env.VITE_BACKEND_HOST || "http://localhost:3000";
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    // console.log(user); // Para observar cambios en el estado user
  }, [user]);

  const getCitas = async () => {
    try {
      const res = await fetch(`${dbUrl}/menu`, {
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
  // GET ALL CITAS ////////////////////////////
  const getAllCitas = async () => {
    // console.log("trayendo todas las citas");

    try {
      const response = await fetch(`${dbUrl}/admin`, {
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
        // console.log(citasOrdenadas);
      } else {
        console.log("no se encontraron citas");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const cancelarCita = async (id) => {
    Swal.fire({
      title: "¿Desea cancelar la cita?",
      showDenyButton: true,
      denyButtonColor: "#17d036",
      confirmButtonText: "Sí, cancelar mi cita",
      confirmButtonColor: "#e91f64",
      denyButtonText: `NO`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${dbUrl}/eliminar-cita/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            Swal.fire({
              title: "Cita cancelada!",
              icon: "success",
              timer: 1500,
            });
            console.log("cita cancelada");
            getCitas();
            getAllCitas();
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
  const logIn = (dataSesion) => {
    localStorage.setItem("user", JSON.stringify(dataSesion.user));
    localStorage.setItem("accessToken", dataSesion.accessToken);
    localStorage.setItem("refreshToken", dataSesion.refreshToken);
    setUser(dataSesion.user);
  };

  const logOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const data = {
    dbUrl,
    loading,
    user,
    setUser,
    logIn,
    logOut,
    cancelarCita,
    getCitas,
    setCitas,
    citas,
    allCitas,
    getAllCitas,
    setAllCitas,
  };

  return (
    <GeneralContext.Provider value={data}>{children}</GeneralContext.Provider>
  );
};

export { GeneralContext, GeneralProvider };
