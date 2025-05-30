import styles from "./VerClientes.module.css";
import Header from "../../components/Header";
import Tabela from "../../components/Tabela";
import Container from "../../components/Container";
import { useState } from "react";
import axios from "axios";
import { data } from "react-router-dom";
import { useEffect } from "react";
import TelefoneInput from "../../components/TelefoneInput";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";

function VerClientes() {
  const navigate = useNavigate();
  const apiPath = "/cliente";
  const [clientes, setClientes] = useState([]);
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_KEY + apiPath)
      .then((response) => {
        {
          setClientes(response.data);
          console.log(response.data);
        }
      })

      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "Identificador Cliente", width: 150 },
    { field: "nomeCliente", headerName: "Nome do Cliente", width: 290 },
    { field: "cidadeCliente", headerName: "Cidade", width: 150 },
    { field: "enderecoCliente", headerName: "Endereço", width: 280 },
    {
      field: "telefoneCliente",
      headerName: "Telefone",
      width: 180,
      renderCell: (params) => (
        <TelefoneInput
          className={styles.telefoneFormatado}
          value={params.value}
          onValueChange={() => {}}
          disabled={true}
        />
      ),
    },
  ];
  const [estadoModal, setEstadoModal] = useState(false);
  return (
    <>
      <Header />
      <Container>
        <div className={styles.viewVerClientes}>
          <Tabela
            columns={columns}
            rows={clientes}
            onAddClick={() => navigate("/registro-cliente")}
            onEditClick={() => setEstadoModal(true)}
            onDeleteClick={() => console.log("Deletar")}
          />
          <Modal aberto={estadoModal} onFechar={() => setEstadoModal(false)}>
            <label htmlFor="">teste</label>
            <input type="text" placeholder="teste" />
          </Modal>
        </div>
      </Container>
    </>
  );
}
export default VerClientes;
