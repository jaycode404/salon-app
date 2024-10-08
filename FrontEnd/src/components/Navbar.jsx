import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";

export const NavList = () => {
  const logged = ["Menu", "Agendar Cita", "Acerca De"];
  const admin = ["Menu", "Agendar Cita", "Admin"];
  const noLogged = ["LogIn", "Crear Cuenta", "Acerca de"];
  const navigate = useNavigate();
  const { user, logOut, dbUrl } = useContext(GeneralContext);

  const handleCerrarSesion = async () => {
    try {
      await fetch(`${dbUrl}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      logOut();
      console.log("session cerrada");
      navigate("/");
    } catch (err) {
      console.log(err, "no se pudo cerrar sesion");
    }
  };

  const getNavLinks = () => {
    if (user) {
      return user.admin === 1 ? admin : logged;
    } else return noLogged;
  };
  return (
    <div className="navlist-container">
      {getNavLinks().map((link, i) => (
        <Link key={i} to={`/${link.toLowerCase().replace(/ /g, "-")}`}>
          {link}
        </Link>
      ))}
      {user && (
        <button className="button button-black" onClick={handleCerrarSesion}>
          Cerrar Sesión
        </button>
      )}
    </div>
  );
};

export function Navbar() {
  const { user } = useContext(GeneralContext);
  return (
    <nav className="nav-container">
      <div className="logo-container">
        <img className="logo-tijeras" src="/assets/tijeras.png" alt="" />
        <Link to={`/`}>SALON</Link>
      </div>
      <NavList />
    </nav>
  );
}
