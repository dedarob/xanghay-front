import { DataSourceRowsUpdateStrategy } from "@mui/x-data-grid/internals";
import axios from "axios";
const apiPath = "/cliente";

export function fetch(data, navigate) {
  if (
    !data ||
    !data.nomeCliente ||
    !data.cidadeCliente ||
    !data.enderecoClienteRegistro ||
    !data.telefoneCliente
  ) {
    alert("array vazio");
    return;
  }
  axios
    .post(import.meta.env.VITE_BACKEND_KEY + apiPath, {
      nomeCliente: data.nomeCliente,
      cidadeCliente: data.cidadeCliente,
      enderecoCliente: data.enderecoClienteRegistro,
      telefoneCliente: data.telefoneCliente,
    })

    .then(() => {
      {
        console.log(data);
        alert("Registro realizado com sucesso!");
        navigate("/");
      }
    })

    .catch((error) => {
      console.log(error.message);
      alert("Erro ao registrar cliente");
    });
}
