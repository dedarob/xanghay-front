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
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

function VerClientes() {
  const navigate = useNavigate();
  const apiPath = "/cliente";
  const [clientes, setClientes] = useState([]);
  const [estadoModal, setEstadoModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [modalDeleteConfirm, setModalDeleteConfirm] = useState(false);
  const abrirModalDelete = () => {
    setModalDeleteConfirm(true);
    gerarCodigoConfirmacao();
  };

  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const buscarClientes = () => {
    axios
      .get(import.meta.env.VITE_BACKEND_KEY + apiPath)
      .then((response) => setClientes(response.data))
      .catch((error) => console.log(error.message));
  };
  useEffect(() => {
    buscarClientes();
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
    const payload = {
      id: data.id,
      nomeCliente: data.nomeCliente,
      cidadeCliente: data.cidadeCliente,
      enderecoCliente: data.enderecoCliente,
      telefoneCliente: data.telefoneCliente,
    };

    axios
      .put(
        `${import.meta.env.VITE_BACKEND_KEY}/cliente/${selectedRowId}`,
        payload
      )
      .then((res) => {
        console.log(res.data),
          console.log(payload),
          alert("Cliente editado com sucesso");
        buscarClientes();
      })
      .catch((err) => console.log(err));
    setEstadoModal(false);
  };
  const formValues = watch();
  const deletarCliente = () => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_KEY}/cliente/${selectedRowId}`)
      .then(() => {
        alert(`Cliente "${formValues.nomeCliente}" excluído com sucesso`);
        setModalDeleteConfirm(false);
        buscarClientes();
      })
      .catch((error) => console.log(error.message));
  };
  const mensagemDelete = `Tem certeza que deseja apagar o cliente: ${formValues.nomeCliente}?`;
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
            onDeleteClick={() => {
              if (formValues.nomeCliente) {
                abrirModalDelete();
              } else {
                alert("Selecione um cliente");
              }
            }}
            onRowClick={handleRowClick}
            getRowClassName={(params) =>
              params.id === selectedRowId ? styles.selectedRow : ""
            }
          />
          <Modal aberto={estadoModal} onFechar={() => setEstadoModal(false)}>
            <form
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              onSubmit={handleSubmit(onSubmit)}
            >
              {Object.entries(formValues).map(([key, value]) => {
                if (key === "id") return null;

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
          <ConfirmDeleteModal
            aberto={modalDeleteConfirm}
            onFechar={() => setModalDeleteConfirm(false)}
            headerMessage={mensagemDelete}
            onConfirmarDelete={() => {
              deletarCliente();
              setModalDeleteConfirm(false);
            }}
          />
        </div>
      </Container>
    </>
  );
}

export default VerClientes;
