import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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
    console.log(form);
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
      const response = await fetch("http://localhost:3000/crear-cuenta", {
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
          title: "Usuario registrado!",
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
          icon: "error",
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
    <div className="login-form-card">
      <h2>Crea una cuenta</h2>
      <form action="" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input onChange={handleChange} type="text" name="nombre" />
        </div>
        <div>
          <label htmlFor="apellido">Apellido:</label>
          <input onChange={handleChange} type="text" name="apellido" />
        </div>
        <div>
          <label htmlFor="email">email:</label>
          <input onChange={handleChange} type="email" name="email" />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            name="password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            style={{ marginLeft: "10px" }}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <div>
          <label htmlFor="telefono">Telefono:</label>
          <input onChange={handleChange} type="tel" name="telefono" />
        </div>

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
