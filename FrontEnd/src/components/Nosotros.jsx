import React from "react";
import Testimoniales from "./Testimoniales";
import Imagenes from "./Imagenes";
export default function Nosotros() {
  return (
    <section className="nosotros-container">
      <h2>NOSOTROS</h2>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores
        sint deserunt ratione, nulla debitis a fugit dolorum in eveniet
        obcaecati molestiae, soluta, similique tenetur dolorem quaerat eaque
        maxime dolore! Maiores.
      </p>
      <div>
        <Testimoniales />
      </div>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt, sed
        ducimus officia animi ipsum temporibus totam nam repellendus labore
        libero voluptatibus obcaecati fugit, molestiae, itaque dignissimos
        impedit velit eum eveniet?
      </p>
      <Imagenes />
    </section>
  );
}
