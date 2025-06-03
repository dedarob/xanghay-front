import styles from "./ItensNota.module.css";
import Tabela from "../../components/Tabela";
import DinheiroInput from "../../components/DinheiroInput";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import Modal from "../../components/Modal";

function ItensNota() {
  const { idNota } = useParams();
  const [itens, setItens] = useState([]);
  const [totalNotaPorObjeto, setTotalNotaPorObjeto] = useState(0);
  const [totalNota, setTotalNota] = useState(0);
  function somaCadaItem(data) {
    let totalItem = 0;
    let totalTodosItens = 0;
    data.forEach((obj, i) => {
      obj.precoTotal = "";
      totalItem = (obj?.precoUnitario || 0) * (obj?.quantidade || 0);
      obj.precoTotal = totalItem;
      setTotalNota((totalTodosItens += obj.precoTotal));
    });
  }
  useEffect(() => {
    if (!idNota) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_KEY}/notas/itens/${idNota}`)
      .then((res) => {
        setItens(res.data);
        somaCadaItem(res.data);
        console.log(res.data);
        console.log(totalNotaPorObjeto);
      })

      .catch((err) => console.log(err));
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
    setSelectedRowId(params.id);
    resetEdit(params.row);
  };
  const onSubmit = (data) => {
    console.log("submit", data);
    //axios do put vai aqui qnd criar, n esquece de usar o usestate do row no address
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
  return (
    <>
      <Tabela
        columns={columns}
        rows={itens}
        onAddClick={() => {
          resetAdd(dadosDoResetDeAdd);
          setEstadoModalAdicionar(true);
        }}
        onEditClick={() => setEstadoModal(true)}
        onDeleteClick={() => console.log("delete")}
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
            if (key === "id") return null;

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
          <label>Adicionando a nota de Identificador {formValues.notaId}</label>
          {Object.entries(formValuesAdd).map(([key, value]) => {
            if (key === "notaId" || key === "id") return null;

            return (
              <div key={key} className={styles.modalInputGroup}>
                <label htmlFor={key}>{key}</label>
                <input id={key} type="text" {...registerAdd(key)} />
              </div>
            );
          })}
          <button type="submit" className={styles.botaoModal}>
            Salvar
          </button>
        </form>
      </Modal>
    </>
  );
}

export default ItensNota;
