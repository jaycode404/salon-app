import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { GeneralContext } from "../context/GeneralContext";
import { el } from "date-fns/locale";
const formInitial = {
  email: "",
  password: "",
};

export default function Login() {
  const [form, setForm] = useState(formInitial);
  const navigate = useNavigate();
  const { user, logIn, loading, dbUrl } = useContext(GeneralContext);

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
      const response = await fetch(`${dbUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const dataSesion = {
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
        logIn(dataSesion);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Bienvenido!",
          showConfirmButton: false,
          timer: 1500,
        });
        console.log("login exitoso");

        console.log(user);

        if (data.user.admin === 1) {
          navigate("/admin");
        } else {
          navigate("/menu");
        }
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
    <section>
      <h2>Iniciar Sesión</h2>
      <div className="silla-bg"></div>
      <div className="login-form-card">
        <form action="" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input onChange={handleChange} type="email" name="email" />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input onChange={handleChange} type="password" name="password" />
          </div>
          <button className="button button-blue" type="submit">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </section>
  );
}
