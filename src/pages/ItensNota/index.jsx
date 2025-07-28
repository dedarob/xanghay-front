import { useEffect, useState } from "react";

import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import DinheiroInput from "../../components/DinheiroInput";
import Modal from "../../components/Modal";
import { PiSubtitlesDuotone } from "react-icons/pi";
import Tabela from "../../components/Tabela";
import axios from "axios";
import styles from "./ItensNota.module.css";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

function ItensNota() {
  const { idNota } = useParams();
  const [itens, setItens] = useState([]);
  const [totalNotaPorObjeto, setTotalNotaPorObjeto] = useState(0);
  const [totalNota, setTotalNota] = useState(0);

  function somaCadaItem(data) {
    let totalTodosItens = 0;
    const itensAtualizados = data.map((obj) => {
      const precoTotal = (obj?.precoUnitario || 0) * (obj?.quantidade || 0);
      totalTodosItens += precoTotal;
      return { ...obj, precoTotal };
    });
    setTotalNota(totalTodosItens);
    return itensAtualizados;
  }

  const buscarItensPorNota = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_KEY}/notas/itens/${idNota}`
      );
      const itensComTotais = somaCadaItem(res.data);
      setItens(itensComTotais);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!idNota) return;
    buscarItensPorNota();
  }, [idNota]);

  const [estadoModal, setEstadoModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [modalDeleteConfirm, setModalDeleteConfirm] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [formValuesAdd, setFormValuesAdd] = useState({});

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
  } = useForm();
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
  } = useForm();

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "descricao", headerName: "Descrição", width: 200 },
    { field: "quantidade", headerName: "Quantidade", width: 100 },
    { field: "precoUnitario", headerName: "Preço Unitário", width: 130 },
    { field: "precoTotal", headerName: "Preço Total", width: 130 },
  ];

  const onRowClick = (params) => {
    setSelectedRowId(params.row.id);
    setFormValues(params.row);
    setEstadoModal(true);
  };

  const onSubmitEdit = (data) => {
    const payload = {
      descricao: data.descricao,
      quantidade: data.quantidade,
      precoUnitario: data.precoUnitario,
    };

    axios
      .put(
        `${import.meta.env.VITE_BACKEND_KEY}/notas/itens/${selectedRowId}`,
        payload
      )
      .then((response) => {
        alert("Item atualizado com sucesso!");
        setEstadoModal(false);
        buscarItensPorNota();
        console.log("Resposta do servidor:", response.data);
      })
      .catch((error) => {
        console.error("Erro ao atualizar item:", error.message);
      });
  };

  const onSubmitAdd = (data) => {
    const payload = {
      descricao: data.descricao,
      quantidade: data.quantidade,
      precoUnitario: data.precoUnitario,
      notaId: idNota,
    };

    axios
      .post(`${import.meta.env.VITE_BACKEND_KEY}/notas/itens`, payload)
      .then((response) => {
        alert("Item adicionado com sucesso!");
        setEstadoModal(false);
        buscarItensPorNota();
        console.log("Resposta do servidor:", response.data);
      })
      .catch((error) => {
        console.error("Erro ao adicionar item:", error.message);
      });
  };

  const deletarItemCliente = (id, descricao) => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_KEY}/notas/itens/${id}`)
      .then((response) => {
        alert(`Item "${descricao}" deletado com sucesso!`);
        buscarItensPorNota();
        console.log("Resposta do servidor:", response.data);
      })
      .catch((error) => {
        console.error("Erro ao deletar item:", error.message);
      });
  };

  const abrirModalDelete = () => {
    setModalDeleteConfirm(true);
  };

  const mensagemDeleteVar = `Tem certeza que deseja deletar o item "${formValues.descricao}"?`;

  return (
    <>
      <Header />
      <Container>
        <div className={styles.areaTabela}>
          <Tabela
            columns={columns}
            rows={itens}
            onRowClick={onRowClick}
            onDeleteClick={abrirModalDelete}
          />
        </div>

        <div className={styles.areaTotal}>
          <label>Total da Nota: R$ {totalNota.toFixed(2)}</label>
        </div>

        <div className={styles.areaBotoes}>
          <button
            onClick={() => {
              setFormValuesAdd({ notaId: idNota });
              setEstadoModal(true);
            }}
            className={styles.botaoAdd}
          >
            <PiSubtitlesDuotone />
          </button>
        </div>

        <Modal aberto={estadoModal} onFechar={() => setEstadoModal(false)}>
          {selectedRowId ? (
            <form onSubmit={handleSubmitEdit(onSubmitEdit)}>
              <h2>Editar Item</h2>
              {Object.keys(formValues).map((key) => {
                if (key === "id" || key === "precoTotal") return null;
                return (
                  <div key={key} className={styles.modalInputGroup}>
                    <label htmlFor={key}>{key}</label>
                    <input id={key} type="text" {...registerEdit(key)} />
                  </div>
                );
              })}
              <button type="submit" className={styles.botaoModal}>
                Salvar
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitAdd(onSubmitAdd)}>
              <h2>Adicionar Item</h2>
              {["descricao", "quantidade", "precoUnitario"].map((key) => (
                <div key={key} className={styles.modalInputGroup}>
                  <label htmlFor={key}>{key}</label>
                  <input id={key} type="text" {...registerAdd(key)} />
                </div>
              ))}
              <label>
                Adicionando a nota de Identificador ({formValuesAdd.notaId})
              </label>
              <button type="submit" className={styles.botaoModal}>
                Salvar
              </button>
            </form>
          )}
        </Modal>

        <ConfirmDeleteModal
          aberto={modalDeleteConfirm}
          onFechar={() => setModalDeleteConfirm(false)}
          headerMessage={mensagemDeleteVar}
          onConfirmarDelete={() => {
            deletarItemCliente(selectedRowId, formValues.descricao);
            setModalDeleteConfirm(false);
          }}
        />
      </Container>
    </>
  );
}

export default ItensNota;
