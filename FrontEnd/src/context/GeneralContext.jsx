import React, { createContext, useState } from "react";

const GeneralContext = createContext();

const GeneralProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [sesion, setSesion] = useState(
    Boolean(localStorage.getItem("accessToken"))
  );
  const logIn = () => {
    setIsLoggedIn(true);
  };

  const logOut = () => {
    setIsLoggedIn(false);
  };

  const data = {
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
