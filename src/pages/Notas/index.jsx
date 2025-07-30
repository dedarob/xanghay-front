import { useEffect, useState } from "react";

import { BotaoVoltar } from "../../components/Container";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import Container from "../../components/Container";
import DinheiroInput from "../../components/DinheiroInput";
import Header from "../../components/Header";
import SelectBox from "../../components/SelectBox";
import Tabela from "../../components/Tabela";
import axios from "axios";
import { formatarDataBrasileira } from "../../components/formatarDataBrasileira";
import styles from "./Notas.module.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function Notas() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [notas, setNotas] = useState([]);

  const columns = [
    { field: "id", headerName: "ID Nota", width: 100 },
    {
      field: "dataEmissao",
      headerName: "Data de Emissão",
      width: 180,
      renderCell: (params) => (
        <span>{formatarDataBrasileira(params.value)}</span>
      ),
    },
    { field: "idCliente", headerName: "ID Cliente", width: 120 },
    { field: "nomeCliente", headerName: "Nome Cliente", width: 200 },
    {
      field: "valorTotal",
      headerName: "Valor Total",
      width: 150,
      renderCell: (params) => (
        <DinheiroInput
          className={styles.dinheiroFormatado}
          value={params.value}
          onValueChange={() => {}}
          disabled={true}
        />
      ),
    },
  ];

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_KEY + "/cliente", {
        params: { returnTypes: "idAndNome" },
      })
      .then((res) => {
        const mapped = res.data.map((c) => ({
          value: c.id,
          label: c.nomeCliente,
        }));
        setClientes(mapped);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!clienteSelecionado) return;

    axios
      .get(
        `${import.meta.env.VITE_BACKEND_KEY}/notas/detailed/${
          clienteSelecionado.value
        }`
      )
      .then((res) => setNotas(res.data))
      .catch((err) => console.log(err));
  }, [clienteSelecionado]);
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const handleRowClickInDeleteMode = (params) => {
    setSelectedRowId(params.row.id);
  };
  const deletarNota = (selectedRowId) => {
    axios
      .delete(
        `${
          import.meta.env.VITE_BACKEND_KEY
        }/notas/deletar-nota/${selectedRowId}`
      )
      .then(() => {
        alert(`Nota de ID ${selectedRowId} excluída com sucesso`);
        setModalDeleteConfirm(false);
        buscarItensPorNota();
      })
      .catch((error) => console.log(error.message));
  };
  return (
    <>
      <Header />
      <BotaoVoltar />
      <Container>
        <h2>Notas por Cliente</h2>
        <SelectBox
          options={clientes}
          isSearchable={true}
          onChange={setClienteSelecionado}
          value={clienteSelecionado}
          placeholder="Clique para pesquisar o cliente"
        />
        <div className={styles.viewVerClientes}>
          <Tabela
            columns={columns}
            rows={notas}
            onRowClick={(params) => {
              console.log("ID da nota:", params.row.id);
              navigate(
                `/itens-nota/${params.row.id}/${clienteSelecionado.value}`
              );
            }}
            onDeleteClick={() => setModalDelete(true)}
            onDollarClick={() => navigate("/nota-fin")}
          />
        </div>
      </Container>
      <ConfirmDeleteModal
        aberto={modalDelete}
        onFechar={() => setModalDelete(false)}
        className={styles.deleteModal}
        onConfirmarDelete={() => {
          deletarNota(selectedRowId);
          setModalDelete(false);
        }}
      >
        <div className={styles.areaTabelaModal}>
          <Tabela
            columns={columns}
            rows={notas}
            onRowClick={(params) => {
              console.log("nota pra deletar:", params.row.id);
              handleRowClickInDeleteMode(params);
            }}
          />
        </div>
      </ConfirmDeleteModal>
    </>
  );
}

export default Notas;
