import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import DinheiroInput from "../../components/DinheiroInput";
import Modal from "../../components/Modal";
import { PiSubtitlesDuotone } from "react-icons/pi";
import Tabela from "../../components/Tabela";
import axios from "axios";
import styles from "./ItensNota.module.css";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useState } from "react";

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
  const buscarItensPorNota = () => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_KEY}/notas/itens/${idNota}`)
      .then((res) => {
        const itensComTotais = somaCadaItem(res.data);
        setItens(itensComTotais);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    if (!idNota) return;
    buscarItensPorNota();
  }, [idNota]);

  const columns = [
    { field: "notaId", headerName: "Identificador Nota", width: 130 },
    { field: "descricao", headerName: "Produto/Serviço", width: 290 },
    { field: "quantidade", headerName: "Quantidade", width: 120 },
    {
      field: "precoUnitario",
      headerName: "Preco Unitario",
      width: 250,
      renderCell: (params) => (
        <DinheiroInput
          className={styles.dinheiroFormatado}
          value={params.value}
          onValueChange={() => {}}
          disabled={true}
        />
      ),
    },
    {
      field: "precoTotal",
      headerName: "Preco Total Por Item",
      width: 250,
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
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    watch: watchEdit,
    reset: resetEdit,
  } = useForm();

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    watch: watchAdd,
  } = useForm();
  const [estadoModal, setEstadoModal] = useState(false);
  const [estadoModalAdicionar, setEstadoModalAdicionar] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const formValues = watchEdit();
  const formValuesAdd = watchAdd();
  const handleRowClick = (params) => {
    console.log("linha clicada: ", params.row);
    setSelectedRowId(params.id);
    resetEdit(params.row);
    setMensagemDeleteVar(
      "Tem certeza que deseja deletar o item " + params.row.descricao + "?"
    );
  };
  const onSubmit = (data) => {
    console.log("submit", data);
    //axios do put vai aqui qnd criar, n esquece de usar o usestate do row no address
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_KEY}/notas/modificar-item/${
          data.notaId
        }/item/${data.id}`,
        data
      )

      .then((response) => {
        {
          console.log(data);
          alert("Registro realizado com sucesso!");
          console.log("oq foi submitado" + response.data);
          navigate("/");
        }
      })

      .catch((error) => {
        console.log(error.message);
      });
  };
  const onAddSubmit = (data) => {
    console.log("submit de add", data);
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_KEY}/notas/colocar-item/${idNota}`,
        data
      )

      .then(() => {
        {
          console.log(data);
          alert("Registro realizado com sucesso!");
          navigate("/");
        }
      })

      .catch((error) => {
        console.log(error.message);
      });
  };
  const dadosDoResetDeAdd = {
    descricao: "",
    quantidade: 0,
    precoUnitario: 0,
    precoTotal: 0,
  };
  const [modalDeleteConfirm, setModalDeleteConfirm] = useState(false);
  const [mensagemDeleteVar, setMensagemDeleteVar] = useState("");
  const deletarItemCliente = (id, descricao) => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_KEY}/notas/deletar-item/${id}`)
      .then(() => {
        alert(`Item "${descricao}" excluído com sucesso`);
        setModalDeleteConfirm(false);
        buscarItensPorNota();
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <>
      <Tabela
        columns={columns}
        rows={itens}
        onAddClick={() => {
          resetAdd({ ...dadosDoResetDeAdd, notaId: idNota });
          setEstadoModalAdicionar(true);
        }}
        onEditClick={() => setEstadoModal(true)}
        onDeleteClick={() => setModalDeleteConfirm(true)}
        onRowClick={handleRowClick}
      />
      <DinheiroInput
        className={styles.dinheiroFormatado}
        value={totalNota}
        onValueChange={() => {}}
        disabled={true}
      />
      <Modal aberto={estadoModal} onFechar={() => setEstadoModal(false)}>
        <form
          onSubmit={handleSubmitEdit((data) => {
            onSubmit(data);
          })}
        >
          {Object.entries(formValues).map(([key, value]) => {
            if (key === "notaId" || key === "id" || key === "precoTotal")
              return null;

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
      </Modal>
      <Modal
        aberto={estadoModalAdicionar}
        onFechar={() => setEstadoModalAdicionar(false)}
      >
        <form
          onSubmit={handleSubmitAdd((data) => {
            onAddSubmit(data);
          })}
        >
          {" "}
          <label>
            Adicionando a nota de Identificador ({formValuesAdd.notaId})
          </label>
          {Object.entries(formValuesAdd).map(([key, value]) => {
            if (key === "notaId" || key === "id" || key === "precoTotal")
              return null;

            return (
              <div key={key} className={styles.modalInputGroup}>
                <label htmlFor={key}>{key}</label>
                {key === "precoUnitario" ? (
                  <DinheiroInput
                    value={value}
                    onValueChange={(val) => {
                      resetAdd({ ...formValuesAdd, [key]: val });
                    }}
                  />
                ) : (
                  <input id={key} type="text" {...registerAdd(key)} />
                )}
              </div>
            );
          })}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label htmlFor="">
              Preço Total: R$
              {formValuesAdd.precoUnitario * formValuesAdd.quantidade}
            </label>
            <button type="submit" className={styles.botaoModal}>
              Salvar
            </button>
          </div>
        </form>
      </Modal>
      <ConfirmDeleteModal
        aberto={modalDeleteConfirm}
        onFechar={() => setModalDeleteConfirm(false)}
        headerMessage={mensagemDeleteVar}
        onConfirmarDelete={() => {
          deletarItemCliente(formValues.id, formValues.descricao);
          setModalDeleteConfirm(false);
        }}
        className={styles.modalDeDeletar}
      ></ConfirmDeleteModal>
    </>
  );
}

export default ItensNota;
