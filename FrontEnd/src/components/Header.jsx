import React, { useContext, useEffect } from "react";
import Login from "./Login";
import { GeneralContext } from "../context/GeneralContext";


export default function Header() {
  const {dbUrl} = useContext(GeneralContext)
  useEffect(() => {
    console.log(dbUrl)
  }, [])
  return (
    <header className="header-container">
      <div>
        <h1 className="header-title">BIENVENIDO</h1>
        <p>La experiencia es inigualable</p>
        <button className="button button-blue">CONTACTANOS</button>
      </div>
      <div className="header-image-container">
        <div className="water-bg"></div>
        <img className="header-image" src="/assets/shampoo.webp" alt="shampoo" />
      </div>
    </header>
  );
}
