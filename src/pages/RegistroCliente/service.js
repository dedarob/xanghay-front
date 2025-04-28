import axios from "axios";
const apiPath = "/cliente";

export function fetch(data, navigate) {
  axios
    .post(import.meta.env.VITE_BACKEND_KEY + apiPath, {
      nomeCliente: data.nomeCliente,
      cidadeCliente: data.cidadeCliente,
      enderecoCliente: data.enderecoClienteRegistro,
      telefoneCliente: data.telefoneCliente,
    })

    .then(() => {
      alert("Registro realizado com sucesso!");
      navigate("/");
    })

    .catch((error) => {
      console.log(error.message);
    });
}
