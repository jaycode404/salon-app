import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { GeneralContext } from "../context/GeneralContext";
const formInitial = {
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  telefono: "",
};

export default function CreateAccount() {
  const [form, setForm] = useState(formInitial);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { dbUrl } = useContext(GeneralContext);
  //validar numero ///////////////////////////
  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };
  //HANDLECHANGE ////////////////////////////////
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    // console.log(form);
  };

  //handleSubmit///////////////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submiting");

    if (!validatePhone(form.telefono)) {
      Swal.fire({
        icon: "error",
        title: "Número de teléfono inválido",
        text: "El número de teléfono debe tener 10 dígitos.",
      });
      return;
    }
    const loadingSwal = Swal.fire({
      html: `<div class="swal2-loading"></div>
      <p>Estamos creando su cuenta...</p>`,
      title: "Creando Usuario",

      showConfirmButton: false,
      allowOutsideClick: false,
      icon: "loading",
    });

    try {
      setLoading(true);
      const response = await fetch(`${dbUrl}}/crear-cuenta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        loadingSwal.close();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Usuario registrado! ",
          text: "Revisa tu email para confirmar tu cuenta e inicia sesion..",
          showConfirmButton: true,
        });
        console.log("Registro exitoso", data);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        loadingSwal.close();
        Swal.fire({
          icon: "warning",
          title: `${data.message}`,
        });
        console.log("login error", data);
      }
    } catch (err) {
      loadingSwal.close();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error en la conección!",
      });
      console.error("Fetch error: ", err);
    }
  };
  //mostrar pssw /////////////////////
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <section>
      <h2>Crea una cuenta</h2>
      <div className="items-bg"></div>
      <div className="create-form-card">
        <form action="" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre">Nombre:</label>
            <input
              onChange={handleChange}
              type="text"
              name="nombre"
              placeholder="Su nombre..."
            />
          </div>
          <div>
            <label htmlFor="apellido">Apellido:</label>
            <input
              onChange={handleChange}
              type="text"
              name="apellido"
              placeholder="Su apellido"
            />
          </div>
          <div>
            <label htmlFor="email">E-mail:</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Su e-mail"
            />
          </div>
          <div className="form-password-container">
            <div>
              <label htmlFor="password">Password:</label>
              <input
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Su password, asegure recordarlo"
              />
            </div>
            <button
              className="button button-black"
              type="button"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <div>
            <label htmlFor="telefono">Telefono:</label>
            <input
              onChange={handleChange}
              type="tel"
              name="telefono"
              placeholder="Telefono principal de contacto"
            />
          </div>

          <button className="button button-green" type="submit">
            crear cuenta
          </button>
        </form>
      </div>
    </section>
  );
}
