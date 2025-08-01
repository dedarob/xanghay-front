import { useNavigate, useParams } from "react-router-dom";

import { BotaoVoltar } from "../../components/Container";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import DinheiroInput from "../../components/DinheiroInput";
import Modal from "../../components/Modal";
import { PiFilePdf } from "react-icons/pi";
import { PiSubtitlesDuotone } from "react-icons/pi";
import Tabela from "../../components/Tabela";
import autoTable from "jspdf-autotable";
import axios from "axios";
import cabecalho from "../../assets/cabecalho.png";
import jsPDF from "jspdf";
import styles from "./ItensNota.module.css";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";

function ItensNota() {
  const { idNota } = useParams();
  const { idCliente } = useParams();
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
  const navigate = useNavigate();
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
  function puxarDadosDoClienteParaPdf() {}
  // Função para gerar PDF dos itens da nota
  async function getImageDataUrl(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = "anonymous"; // importante para evitar tainting se for carregado de outro domínio
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx)
          return reject(new Error("Não foi possível obter contexto do canvas"));
        ctx.drawImage(img, 0, 0);
        try {
          const dataUrl = canvas.toDataURL("image/png"); // força PNG
          resolve(dataUrl);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = (e) =>
        reject(new Error("Falha ao carregar a imagem: " + e));
    });
  }

  async function fetchImageAsDataURL(url) {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") resolve(reader.result);
        else reject("Erro convertendo imagem");
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  function sanitizeNomeCliente(nome) {
    // remove acentos
    const semAcento = nome.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    // mantém apenas letras, números e hífens, troca espaços por hífen
    return semAcento
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^A-Za-z0-9\-]/g, "")
      .toUpperCase();
  }
  async function handleGerarPDF() {
    try {
      // Busca cliente e imagem em paralelo
      const [clienteRes, imagemDataUrl] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_BACKEND_KEY}/cliente/pelo-id/${idCliente}`
        ),
        getImageDataUrl(cabecalho),
      ]);

      const dadosDoCliente = clienteRes.data;

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 10;

      // Desenha cabeçalho com imagem (mantém proporção)
      const imgProps = doc.getImageProperties(imagemDataUrl);
      const maxImgWidth = pageWidth - 20; // margem 10 de cada lado
      const ratio = imgProps.width / imgProps.height;
      const imgWidth = Math.min(maxImgWidth, imgProps.width);
      const imgHeight = imgWidth / ratio;
      doc.addImage(imagemDataUrl, "PNG", 10, y, imgWidth, imgHeight);
      y += imgHeight + 6;

      // Título
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      y += 8;

      // Dados do cliente
      doc.setFontSize(11);
      doc.setFont(undefined, "normal");
      doc.text(`Cliente: ${dadosDoCliente.nomeCliente}`, 10, y);
      doc.text(`Cidade: ${dadosDoCliente.cidadeCliente}`, 10, y + 6);
      doc.text(`Endereço: ${dadosDoCliente.enderecoCliente}`, 10, y + 12);
      doc.text(`Telefone: ${dadosDoCliente.telefoneCliente}`, 10, y + 18);
      y += 24;

      // ID da Nota
      doc.setFont(undefined, "bold");
      doc.text(`Nota ID: ${idNota}`, 10, y);
      y += 8;
      doc.setFont(undefined, "normal");

      // Montar dados para a tabela
      const headers = [["Qtd", "Descrição", "Unitário", "Total"]];
      const data = itens.map((item) => [
        item.quantidade,
        item.descricao,
        `R$ ${Number(item.precoUnitario).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
        `R$ ${Number(item.precoTotal).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
      ]);

      autoTable(doc, {
        head: headers,
        body: data,
        startY: y,
        styles: {
          fontSize: 10,
          cellPadding: 2,
          lineColor: [0, 0, 0],
          lineWidth: 0.3,
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 90 },
          2: { cellWidth: 35 },
          3: { cellWidth: 35 },
        },
        margin: { left: 10, right: 10 },
        didDrawPage: (data) => {
          y = data.cursor.y + 6;
        },
      });

      // Total Geral (colocado abaixo da tabela)
      doc.setFont(undefined, "bold");
      const totalText = `Total Geral: R$ ${Number(totalNota).toLocaleString(
        "pt-BR",
        {
          minimumFractionDigits: 2,
        }
      )}`;
      // calcula largura do texto pra alinhar à direita com margem
      const textWidth = doc.getTextWidth(totalText);
      doc.text(totalText, pageWidth - 10 - textWidth, y);

      // Salva
      const nomeSanitizado = sanitizeNomeCliente(
        dadosDoCliente.nomeCliente || "SEM-NOME"
      );
      const fileName = `${nomeSanitizado}-${idNota}-.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error("Erro gerando PDF:", err);
      alert("Falha ao gerar PDF. Veja o console para mais detalhes.");
    }
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
        <PiFilePdf />
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
