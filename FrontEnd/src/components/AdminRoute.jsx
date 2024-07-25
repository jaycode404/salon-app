import React, { useContext } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";

const AdminRoute = ({ path, ...props }) => {
  const { user, loading } = useContext(GeneralContext);
  if (loading) {
    return <div>Cargando...</div>;
  }
  return (
    <>
      {!loading && user !== null && user.admin === 1 ? (
        <Outlet />
      ) : (
        <Navigate to={user !== null ? "/menu" : "/login"} />
      )}
    </>
  );
};

export default AdminRoute;
