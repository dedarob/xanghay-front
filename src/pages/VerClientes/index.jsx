import styles from "./VerClientes.module.css";
import Header from "../../components/Header";
import Tabela from "../../components/Tabela";
import Container from "../../components/Container";
import { useState, useEffect } from "react";
import axios from "axios";
import TelefoneInput from "../../components/TelefoneInput";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import { useForm } from "react-hook-form";

function VerClientes() {
  const navigate = useNavigate();
  const apiPath = "/cliente";
  const [clientes, setClientes] = useState([]);
  const [estadoModal, setEstadoModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const { register, handleSubmit, setValue, watch, reset } = useForm();

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_KEY + apiPath)
      .then((response) => setClientes(response.data))
      .catch((error) => console.log(error.message));
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

  const handleRowClick = (params) => {
    setSelectedRowId(params.id);
    reset(params.row);
  };

  const onSubmit = (data) => {
    console.log("pra salvar:", data);
    //axios aq
    setEstadoModal(false);
  };

  const formValues = watch();

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
            onRowClick={handleRowClick}
            getRowClassName={(params) =>
              params.id === selectedRowId ? styles.selectedRow : ""
            }
          />
          <Modal aberto={estadoModal} onFechar={() => setEstadoModal(false)}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {Object.entries(formValues).map(([key, value]) => {
                if (key === "id") return null; // Não mostra o ID

                return (
                  <div key={key} className={styles.modalInputGroup}>
                    <label htmlFor={key}>{key}</label>
                    {key === "telefoneCliente" ? (
                      <TelefoneInput
                        id={key}
                        value={value}
                        onValueChange={(val) => setValue(key, val)}
                      />
                    ) : (
                      <input id={key} type="text" {...register(key)} />
                    )}
                  </div>
                );
              })}

              <button type="submit" className={styles.botaoModal}>
                Salvar
              </button>
            </form>
          </Modal>
        </div>
      </Container>
    </>
  );
}

export default VerClientes;
