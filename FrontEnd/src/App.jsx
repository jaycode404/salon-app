import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import { Navbar } from "./components/Navbar";
import Login from "./components/Login";
import Menu from "./components/Menu";
import CreateAccount from "./components/CreateAccount";
import AcercaDe from "./components/AcercaDe";
import Agendar from "./components/Agendar";
import PrivateRoutes from "./components/PrivateRoutes";
import AdminPanel from "./components/AdminPanel";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* PRIVATE//////////////////// */}
        <Route element={<PrivateRoutes />}>
          <Route path="/home" element={<Home />} exact />
          <Route path="/" element={<Menu />} />
          <Route path="/agendar-cita" element={<Agendar />} />
        </Route>
        {/* PRIVATE//////////////////// */}
        {/* ADMIN PANEL//////////////////// */}
        <Route>
          <Route path="/admin" element={<AdminPanel/>}/>
        </Route>
        {/* ADMIN PANEL//////////////////// */}


        <Route path="/acerca-de" element={<AcercaDe />} />
        <Route path="/crear-cuenta" element={<CreateAccount />} />
        <Route path="/login" element={<Home />} />
        <Route path="*" element={<Navigate to="/" />} />
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
