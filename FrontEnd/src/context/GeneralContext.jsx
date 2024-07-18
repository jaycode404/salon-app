import React, { createContext, useEffect, useState } from "react";

const GeneralContext = createContext();

const GeneralProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [sesion, setSesion] = useState(
    Boolean(localStorage.getItem("accessToken"))
  );
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

  const logIn = () => {
    setIsLoggedIn(true);
  };

  const logOut = () => {
    setIsLoggedIn(false);
  };

  const data = {
    loading,
    user,
    setUser,
    sesion,
    setSesion,
    isLoggedIn,
    logIn,
    logOut,
    setIsLoggedIn,
  };

  return (
    <GeneralContext.Provider value={data}>{children}</GeneralContext.Provider>
  );
};

export { GeneralContext, GeneralProvider };
