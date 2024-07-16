import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";

export const NavList = ({}) => {
  const logged = ["Menu", "Agendar Cita"];
  const noLogged = ["Login", "Acerca de"];
  const navigate = useNavigate();
  const { isLoggedIn, logOut } = useContext(GeneralContext);
  
  const [sesion, setSesion] = useState(Boolean(localStorage.getItem("accessToken")));

  useEffect(() => {
    setSesion(isLoggedIn);
  }, [isLoggedIn]);

  const handleCerrarSesion = async () => {
    try {
      await fetch("http://localhost:3000/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      logOut();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      console.log("session cerrada");
      console.log(isLoggedIn);
      navigate("/");
    } catch (err) {
      console.log(err, "no se pudo cerrar sesion");
    }
  };
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
          <Link key={i} to={`/${link.toLocaleLowerCase().replace(/ /g, "-")}`}>
            {link}
          </Link>
        ))
      )}
    </div>
  );
};
export function Navbar() {
  
  return (
    <nav>
      <Link to={"/"}>Logo</Link>
      <NavList />
    </nav>
  );
}
