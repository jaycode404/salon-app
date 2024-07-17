import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const formInitial = {
  nombre: "",
  email: "",
  password: "",
};

export default function CreateAccount() {
  const [form, setForm] = useState(formInitial);
  const navigate = useNavigate();

  //   useEffect(() => {
  //     console.log(form);
  //   }, []);
  //handleChange
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    console.log(form);
  };

  //handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submiting");

    const nombre = form.nombre;
    const email = form.email;
    const password = form.password;
    console.log(nombre, email, password);
    try {
      const response = await fetch("http://localhost:3000/crear-cuenta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Usuario registrado!",
          showConfirmButton: false,
          timer: 1500,
        });
        console.log("Registro exitoso", data);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Formato de datos incorrecto",
        });
        console.log("login error", data);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error en la conección!",
      });
      console.error("Fetch error: ", err);
    }
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
          <label htmlFor="email">email:</label>
          <input onChange={handleChange} type="email" name="email" />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input onChange={handleChange} type="password" name="password" />
        </div>
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
