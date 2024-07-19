import React, { createContext, useEffect, useState } from "react";

const GeneralContext = createContext();

const GeneralProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    console.log(user); // Para observar cambios en el estado user
  }, [user]);

  const logIn = (dataSesion) => {
    localStorage.setItem("user", JSON.stringify(dataSesion.user));
    localStorage.setItem("accessToken", dataSesion.accessToken);
    localStorage.setItem("refreshToken", dataSesion.refreshToken);
    setUser(dataSesion.user);
  };

  const logOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const data = {
    loading,
    user,
    setUser,
    logIn,
    logOut,
  };

  return (
    <GeneralContext.Provider value={data}>{children}</GeneralContext.Provider>
  );
};

export { GeneralContext, GeneralProvider };
