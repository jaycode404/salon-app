import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { GeneralContext } from "../context/GeneralContext";
const formInitial = {
  email: "",
  password: "",
};

export default function Login() {
  const [form, setForm] = useState(formInitial);
  const navigate = useNavigate();
  const { isLoggedIn, logIn } = useContext(GeneralContext);

  //handleChange
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    // console.log(form);
  };

  //handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submiting");

    const email = form.email;
    const password = form.password;
    console.log(email, password);
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        logIn()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Bienvenido!",
          showConfirmButton: false,
          timer: 1500,
        });
        console.log("login exitoso");
        console.log(isLoggedIn);
        setTimeout(() => {
          navigate("/menu");
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Datos incorrectos!",
        });
        console.log("login error");
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
      <form action="" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">email:</label>
          <input onChange={handleChange} type="email" name="email" />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input onChange={handleChange} type="password" name="password" />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
