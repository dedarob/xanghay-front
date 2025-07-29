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
import { BotaoVoltar } from "../../components/Container";
import jsPDF from "jspdf";

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
          alert("Item registrado com sucesso!");
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

  // Função para gerar PDF dos itens da nota
  function handleGerarPDF() {
    const doc = new jsPDF();
    const pageWidth = 210; // mm (A4)
    let y = 15;

    // Cabeçalho
    doc.setFontSize(18);
    doc.text("Relatório de Itens da Nota", pageWidth / 2, y, {
      align: "center",
    });
    y += 10;

    // Dados da Nota (ID)
    doc.setFontSize(12);
    doc.text(`Nota ID: ${idNota}`, 10, y);
    y += 8;

    // Tabela - Cabeçalho
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Qtd", 10, y);
    doc.text("Descrição", 30, y);
    doc.text("Unitário", 120, y);
    doc.text("Total", 160, y);
    doc.setFont(undefined, "normal");
    y += 6;
    doc.line(10, y, 200, y);
    y += 4;

    // Tabela - Itens
    itens.forEach((item) => {
      if (y > 280) {
        doc.addPage();
        y = 15;
      }
      doc.text(String(item.quantidade), 10, y);
      doc.text(String(item.descricao), 30, y, { maxWidth: 85 });
      doc.text(
        `R$ ${Number(item.precoUnitario).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
        120,
        y
      );
      doc.text(
        `R$ ${Number(item.precoTotal).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
        160,
        y
      );
      y += 7;
    });

    y += 5;
    doc.setFont(undefined, "bold");
    doc.text(
      `Total Geral: R$ ${Number(totalNota).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      120,
      y
    );
    doc.setFont(undefined, "normal");

    doc.save(`itens-nota-${idNota}.pdf`);
  }

  return (
    <>
      <BotaoVoltar />
      <button
        onClick={handleGerarPDF}
        style={{
          marginBottom: 16,
          padding: "8px 18px",
          borderRadius: 6,
          border: "1px solid #1976d2",
          background: "#1976d2",
          color: "#fff",
          fontWeight: 500,
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Gerar PDF
      </button>
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
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
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
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
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
