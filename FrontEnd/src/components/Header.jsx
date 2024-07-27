import React from "react";
import Login from "./Login";

export default function Header() {
  return (
    <header className="header-container">
      <div>
        <h1 className="header-title">BIENVENIDO</h1>
        <p>La experiencia es inigualable</p>
        <button className="button button-blue">CONTACTANOS</button>
      </div>
      <div className="header-image-container">
        <div className="water-bg"></div>
        <img className="header-image" src="/assets/shampoo2.png" alt="shampoo" />
      </div>
    </header>
  );
}
