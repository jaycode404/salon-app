import React from "react";
import { useContext } from "react";
import { GeneralContext } from "../context/GeneralContext";
import { Route, Navigate, Outlet } from "react-router-dom";

export default function PrivateRoutes({ path, ...props }) {
  const { user, loading } = useContext(GeneralContext);
  if (loading) {
    return <div>Cargando...</div>;
  }

  return <>{user !== null ? <Outlet /> : <Navigate to="/login" />}</>;
}
