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
import AdminRoute from "./components/AdminRoute";
import ConfirmarEmail from "./components/ConfirmarEmail";
import Footer from "./components/Footer";
import Nosotros from "./components/Nosotros";
import ConfirmarEmailExito from "./components/ConfirmarEmailExito";
import ConfirmarEmailError from "./components/ConfirmarEmailError";

function App() {
  return (
    <>
      <div className="app-container">
        <Navbar />
        <Routes>
          {/* PRIVATE//////////////////// */}
          <Route element={<PrivateRoutes />}>
            <Route path="/menu" element={<Menu />} />
            <Route path="/agendar-cita" element={<Agendar />} />
          </Route>
          {/* PRIVATE//////////////////// */}
          {/* ADMIN PANEL//////////////////// */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
          {/* ADMIN PANEL//////////////////// */}
          <Route path="/" element={<Home />} exact />
          <Route path="/acerca-de" element={<AcercaDe />} />
          <Route path="/crear-cuenta" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/confirmar-email" element={<ConfirmarEmail />} />
          <Route path="/confirmar-email-exito" element={<ConfirmarEmailExito />} />
          <Route path="/confirmar-email-error" element={<ConfirmarEmailError />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

const Home = () => {
  return (
    <div>
      <Header />
      <Nosotros />
    </div>
  );
};

export { App, Home };
