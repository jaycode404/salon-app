import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";

export const NavList = () => {
  const logged = ["Menu", "Agendar Cita", "Acerca De"];
  const noLogged = ["Login", "Crear Cuenta", "Acerca de"];
  const navigate = useNavigate();
  const { sesion, setSesion } = useContext(GeneralContext);
  const token = localStorage.getItem("accessToken");

  const handleCerrarSesion = async () => {
    try {
      await fetch("http://localhost:3000/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setSesion(false);
      console.log("session cerrada");
      navigate("/");
    } catch (err) {
      console.log(err, "no se pudo cerrar sesion");
    }
  };

  useEffect(() => {
    setSesion(Boolean(token));
  }, [token]);

  return (
    <div className="navlist-container">
      {sesion ? (
        <>
          {logged.map((link, i) => (
            <Link key={i} to={`/${link.toLowerCase().replace(/ /g, "-")}`}>
              {link}
            </Link>
          ))}
          <button onClick={handleCerrarSesion}>cerrar sesion</button>
        </>
      ) : (
        noLogged.map((link, i) => (
          <Link key={i} to={`/${link.toLowerCase().replace(/ /g, "-")}`}>
            {link}
          </Link>
        ))
      )}
    </div>
  );
};

export function Navbar() {
  const { sesion, setSesion } = useContext(GeneralContext);
  return (
    <nav>
      <Link to={`${sesion ? "menu" : "/login"}`}>Logo</Link>
      <NavList />
    </nav>
  );
}
