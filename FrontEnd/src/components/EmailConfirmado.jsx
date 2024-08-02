import React from 'react'

export default function EmailConfirmado() {
  return (
    <section>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: ".5rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1
          className={`confirm-message ${
            message ? "user-nombre" : "red-gradient"
          }`}
        >
          {message ? message : "error en el token"}
        </h1>
        <Link to="/login" className="button button-blue">
          Iniciar sesion
        </Link>
      </div>
    </section>
  )
}
