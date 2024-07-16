import React, { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
export default function Menu() {
  const [citas, setCitas] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/menu", {
          method: "GET",
          headers: {
             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUsers(data);
          console.log(data);
        } else {
          navigate('/login')
          console.log("usuarios vacio");
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, []);

  return (
    <div>
      <h2>Menú</h2>
      {/* {citas.length > 0 ? "Estas son tus citas" : "No hay citas..."} */}
      <h2>
        {" "}
        {users.length > 0 ? "Estas son tus usuarios" : "No hay usuarios..."}
      </h2>
      <div>
        {users.map((i, user) => {
          <div key={i}>
            <p>{user.id}</p>
            <p>{user.nombre}</p>
            <p>{user.email}</p>
          </div>;
        })}
      </div>
    </div>
  );
}
