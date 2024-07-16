import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { Navbar } from "./components/Navbar";
import Login from "./components/Login";
import Menu from "./components/Menu";
import CreateAccount from "./components/CreateAccount";
import AcercaDe from "./components/AcercaDe";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/create" element={<CreateAccount />} />
        <Route path="/login" element={<Home />} />
        <Route path="/acerca-de" element={<AcercaDe />} />
      </Routes>
    </>
  );
}

const Home = () => {
  return (
    <div>
      <Header />
      <Login />
    </div>
  );
};

export { App, Home };
