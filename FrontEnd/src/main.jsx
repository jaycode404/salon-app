import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { GeneralProvider } from "./context/GeneralContext";
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GeneralProvider>
      <Router>
        <App />
      </Router>
    </GeneralProvider>
  </React.StrictMode>
);
