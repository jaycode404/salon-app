import React from "react";
import { useContext } from "react";
import { GeneralContext } from "../context/GeneralContext";
import { Route, Navigate } from "react-router-dom";
import Menu from "./Menu";
export default function PrivateRoute({ path, ...props }) {
  const { isLoggedIn } = useContext(GeneralContext);

  return (
    <>
      {isLoggedIn ? (
        <Route path="/manu" element={<Menu />} />
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
}
