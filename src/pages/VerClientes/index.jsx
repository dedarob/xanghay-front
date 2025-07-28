import { useEffect, useState } from "react";

import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import Container from "../../components/Container";
import Header from "../../components/Header";
import Modal from "../../components/Modal";
import Tabela from "../../components/Tabela";
import TelefoneInput from "../../components/TelefoneInput";
import axios from "axios";
import styles from "./VerClientes.module.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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

  const buscarClientes = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_KEY + apiPath
      );
      setClientes(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    buscarClientes();
  }, []);

  const onRowClick = (params) => {
    setSelectedRowId(params.row.id);
    setValue("nomeCliente", params.row.nomeCliente);
    setValue("cidadeCliente", params.row.cidadeCliente);
    setValue("enderecoCliente", params.row.enderecoCliente);
    setValue("telefoneCliente", params.row.telefoneCliente);
    setEstadoModal(true);
  };

  const onSubmit = (data) => {
    const payload = {
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
      .then((response) => {
        alert("Cliente atualizado com sucesso!");
        setEstadoModal(false);
        buscarClientes();
        console.log("Resposta do servidor:", response.data);
      })
      .catch((error) => {
        console.error("Erro ao atualizar cliente:", error.message);
      });
  };

  const deletarCliente = (id, nome) => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_KEY}/cliente/${id}`)
      .then((response) => {
        alert(`Cliente "${nome}" deletado com sucesso!`);
        buscarClientes();
        console.log("Resposta do servidor:", response.data);
      })
      .catch((error) => {
        console.error("Erro ao deletar cliente:", error.message);
      });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nomeCliente", headerName: "Nome", width: 200 },
    { field: "cidadeCliente", headerName: "Cidade", width: 150 },
    { field: "enderecoCliente", headerName: "Endereço", width: 250 },
    { field: "telefoneCliente", headerName: "Telefone", width: 150 },
  ];

  const mensagemDeleteVar = `Tem certeza que deseja deletar o cliente "${watch(
    "nomeCliente"
  )}"?`;

  return (
    <>
      <Header />
      <Container>
        <div className={styles.areaTabela}>
          <Tabela
            columns={columns}
            rows={clientes}
            onRowClick={onRowClick}
            onDeleteClick={abrirModalDelete}
          />
        </div>

        <Modal aberto={estadoModal} onFechar={() => setEstadoModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Editar Cliente</h2>
            <div className={styles.modalInputGroup}>
              <label htmlFor="nomeCliente">Nome</label>
              <input
                id="nomeCliente"
                type="text"
                {...register("nomeCliente")}
              />
            </div>
            <div className={styles.modalInputGroup}>
              <label htmlFor="cidadeCliente">Cidade</label>
              <input
                id="cidadeCliente"
                type="text"
                {...register("cidadeCliente")}
              />
            </div>
            <div className={styles.modalInputGroup}>
              <label htmlFor="enderecoCliente">Endereço</label>
              <input
                id="enderecoCliente"
                type="text"
                {...register("enderecoCliente")}
              />
            </div>
            <div className={styles.modalInputGroup}>
              <label htmlFor="telefoneCliente">Telefone</label>
              <TelefoneInput
                value={watch("telefoneCliente")}
                onValueChange={(value) => setValue("telefoneCliente", value)}
              />
            </div>
            <button type="submit" className={styles.botaoModal}>
              Salvar
            </button>
          </form>
        </Modal>

        <ConfirmDeleteModal
          aberto={modalDeleteConfirm}
          onFechar={() => setModalDeleteConfirm(false)}
          headerMessage={mensagemDeleteVar}
          onConfirmarDelete={() => {
            deletarCliente(selectedRowId, watch("nomeCliente"));
            setModalDeleteConfirm(false);
          }}
        />
      </Container>
    </>
  );
}

export default VerClientes;
