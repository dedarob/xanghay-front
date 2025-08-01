import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { BotaoVoltar } from "../../components/Container";
import Container from "../../components/Container";
import DinheiroInput from "../../components/DinheiroInput";
import Header from "../../components/Header";
import { PiFilePdf } from "react-icons/pi";
import SelectBox from "../../components/SelectBox";
import Tabela from "../../components/Tabela";
import autoTable from "jspdf-autotable";
import axios from "axios";
import cabecalho from "../../assets/cabecalho.png";
import { formatarDataBrasileira } from "../../components/formatarDataBrasileira";
import jsPDF from "jspdf";
import styles from "./NotaFinanceiro.module.css";

export default function NotaFinanceiro() {
  const navigate = useNavigate();
  const columns = [
    { field: "id", headerName: "ID Nota", width: 70 },
    {
      field: "idPagamento",
      headerName: "ID Pagamento Ultimo Pagamento",
      width: 70,
    },
    {
      field: "dataEmissao",
      headerName: "Data de Emissão",
      width: 150,
      renderCell: (params) => (
        <span>{formatarDataBrasileira(params.value)}</span>
      ),
    },
    { field: "nomeCliente", headerName: "Nome Cliente", width: 170 },
    {
      field: "valorTotal",
      headerName: "Valor Nota",
      width: 130,
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
      field: "ultimoPagamentoData",
      headerName: "Data Ultimo Pagamento",
      width: 150,
      renderCell: (params) => (
        <span>{formatarDataBrasileira(params.value)}</span>
      ),
    },
    {
      field: "valorPag",
      headerName: "Valor Ultimo Pagamento",
      width: 130,
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
      field: "resto",
      headerName: "Valor Restante",
      width: 130,
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
      field: "situacao",
      headerName: "Situação Nota",
      width: 200,
      renderCell: (params) => {
        let cor = "";

        switch (params.value) {
          case "PAGO":
            cor = "green";
            break;
          case "PARCIALMENTE PAGO":
            cor = "blue";
            break;
          case "EM ABERTO":
          default:
            cor = "red";
            break;
        }

        return (
          <span
            style={{
              color: cor,
              fontWeight: "bold",
              padding: "0 4px",
              borderRadius: "2px",
              display: "inline",
            }}
          >
            {params.value}
          </span>
        );
      },
    },
  ];

  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [notasSortadas, setNotasSortadas] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_KEY + "/cliente",
          {
            params: { returnTypes: "idAndNome" },
          }
        );
        const mapped = res.data.map((c) => ({
          value: c.id,
          label: c.nomeCliente,
        }));
        setClientes(mapped);
      } catch (err) {
        console.log(err);
      }
    };
    fetchClientes();
  }, []);

  useEffect(() => {
    if (!clienteSelecionado) return;

    const fetchNotas = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_KEY}/pagamentos/sortado/${
            clienteSelecionado.value
          }`
        );
        const data = res.data;
        const mapNotas = new Map();

        data.forEach((item) => {
          const atual = mapNotas.get(item.idNota);
          if (!atual || item.valorRestanteDebito < atual.valorRestanteDebito) {
            mapNotas.set(item.idNota, item);
          }
        });

        const payload = Array.from(mapNotas.values()).map((item) => ({
          id: item.idNota,
          idPagamento: item.idPagamento,
          dataEmissao: item.dataNota,
          nomeCliente: item.nomeCliente,
          valorTotal: item.valorDebito,
          ultimoPagamentoData: item.dataPagamento,
          valorPag: item.valorPago,
          situacao: item.situacao,
          resto: item.valorRestanteDebito,
        }));

        setNotasSortadas(payload);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotas();
  }, [clienteSelecionado]);

  // utilitário para sanitizar nome
  function sanitizeNomeCliente(nome) {
    const semAcento = nome.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    return semAcento
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^A-Za-z0-9\-]/g, "")
      .toUpperCase();
  }

  // converte imagem para dataURL segura
  async function getImageDataUrl(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx)
          return reject(new Error("Não foi possível obter contexto do canvas"));
        ctx.drawImage(img, 0, 0);
        try {
          const dataUrl = canvas.toDataURL("image/png");
          resolve(dataUrl);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = (e) =>
        reject(new Error("Falha ao carregar a imagem: " + e));
    });
  }
  function formatarTelefoneGenerico(telefone) {
    if (!telefone) return "";

    const nums = telefone.replace(/\D/g, "");

    const match = nums.match(/^(\d{2})(\d)(\d{4})(\d{4})$/);

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
    }

    return telefone;
  }
  // Função para gerar relatório PDF abrangente
  async function handleGerarRelatorioPDF() {
    try {
      if (!clienteSelecionado) {
        alert("Selecione um cliente antes de gerar o relatório.");
        return;
      }

      // busca dados completos do cliente
      const clienteRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_KEY}/cliente/pelo-id/${
          clienteSelecionado.value
        }`
      );
      // busca crédito/débito (ajustado para incluir barra)
      const saldoClienteRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_KEY}/pagamentos/pegar-credito/${
          clienteSelecionado.value
        }`
      );
      const dadosDoCliente = clienteRes.data;

      // garante que o saldo seja número
      let saldoClienteValue = saldoClienteRes.data;
      if (typeof saldoClienteValue === "string") {
        saldoClienteValue = Number(saldoClienteValue.replace(",", "."));
      }

      // obtém imagem do cabeçalho
      const imagemDataUrl = await getImageDataUrl(cabecalho);

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 10;

      // cabeçalho com imagem
      const imgProps = doc.getImageProperties(imagemDataUrl);
      const maxImgWidth = pageWidth - 20;
      const ratio = imgProps.width / imgProps.height;
      const imgWidth = Math.min(maxImgWidth, imgProps.width);
      const imgHeight = imgWidth / ratio;
      doc.addImage(imagemDataUrl, "PNG", 10, y, imgWidth, imgHeight);
      y += imgHeight + 6;

      // Título centralizado
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Relatório Financeiro", pageWidth / 2, y, { align: "center" });
      y += 10;

      // Dados do cliente
      doc.setFontSize(11);
      doc.setFont(undefined, "normal");
      doc.text(`Cliente: ${dadosDoCliente.nomeCliente}`, 10, y);
      doc.text(`Cidade: ${dadosDoCliente.cidadeCliente}`, 10, y + 6);
      doc.text(`Endereço: ${dadosDoCliente.enderecoCliente}`, 10, y + 12);
      if (dadosDoCliente.telefoneCliente) {
        const telefoneFormatado = formatarTelefoneGenerico(
          dadosDoCliente.telefoneCliente
        );
        doc.text(`Telefone: ${telefoneFormatado}`, 10, y + 18);
      }
      const dataEmissao = new Date().toLocaleDateString("pt-BR");
      doc.text(`Data de emissão: ${dataEmissao}`, 10, y + 24);

      y += 30;

      // Montar tabela de notas
      const headers = [
        ["ID", "Emissão", "Valor", "Últ. Pag.", "Pago", "Restante", "Situação"],
      ];
      const data = notasSortadas.map((nota) => [
        nota.id,
        nota.dataEmissao
          ? nota.dataEmissao.split("-").reverse().join("/")
          : "-",
        `R$ ${Number(nota.valorTotal).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
        nota.ultimoPagamentoData
          ? nota.ultimoPagamentoData.split("-").reverse().join("/")
          : "-",
        `R$ ${Number(nota.valorPag).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
        `R$ ${Number(nota.resto).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
        nota.situacao,
      ]);

      autoTable(doc, {
        head: headers,
        body: data,
        startY: y,
        styles: {
          fontSize: 10,
          lineWidth: 0.2,
          lineColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
          halign: "left",
          valign: "middle",
        },
        didParseCell: function (dataCell) {
          if (dataCell.column.index === 6) {
            const situacao = dataCell.cell.text[0];
            if (situacao === "PAGO")
              dataCell.cell.styles.textColor = [0, 128, 0];
            else if (situacao === "PARCIALMENTE PAGO")
              dataCell.cell.styles.textColor = [0, 0, 255];
            else if (situacao === "EM ABERTO")
              dataCell.cell.styles.textColor = [255, 0, 0];
          }
        },
        margin: { left: 10, right: 10 },
      });

      // pega onde a tabela terminou (autotable anexa em doc.lastAutoTable)
      const yAfterTable = doc.lastAutoTable?.finalY || y;

      // Crédito ou débito formatado
      const isCredito = saldoClienteValue > 0;
      const label = isCredito ? "Crédito" : "Débito";
      const valorFormatado = `R$ ${Number(
        Math.abs(saldoClienteValue)
      ).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`;
      const creditText = `${label}: ${valorFormatado}`;

      // define cor e peso
      if (isCredito) {
        doc.setTextColor(0, 128, 0);
      } else {
        doc.setTextColor(255, 0, 0);
      }
      doc.setFont(undefined, "bold");

      // alinhar à direita com margem (10) abaixo da tabela
      const textWidth = doc.getTextWidth(creditText);
      doc.text(creditText, pageWidth - 10 - textWidth, yAfterTable + 8);

      // resetar estilo
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "normal");

      // montar nome do arquivo: NOMECLIENTE-ID-RELATORIO.pdf
      const nomeSanitizado = sanitizeNomeCliente(
        dadosDoCliente.nomeCliente || "SEM-NOME"
      );
      const fileName = `${nomeSanitizado}-RELATORIO.pdf`;

      doc.save(fileName);
    } catch (err) {
      console.error("Erro gerando PDF financeiro:", err);
      alert(
        "Falha ao gerar o relatório financeiro. Veja o console para mais detalhes."
      );
    }
  }

  return (
    <>
      <Header />
      <BotaoVoltar />

      <div className={styles.bordaVerde}>
        <Container>
          <Link to={"/notas"}>Clique para voltar a visualização de notas</Link>
          <h1 style={{ color: "green" }}>Modo Financeiro</h1>

          <SelectBox
            options={clientes}
            isSearchable={true}
            onChange={setClienteSelecionado}
            value={clienteSelecionado}
            placeholder="Clique para pesquisar o cliente"
          />
          <button
            onClick={handleGerarRelatorioPDF}
            style={{
              padding: "8px 18px",
              borderRadius: 6,
              border: "1px solid #1976d2",
              background: "#1976d2",
              color: "#fff",
              fontWeight: 500,
              fontSize: "1.5rem",
              cursor: "pointer",
              marginLeft: 8,
            }}
          >
            <PiFilePdf />
          </button>
          <Tabela
            className={styles.tabelaFinanceiro}
            columns={columns}
            rows={notasSortadas}
            onRowClick={(params) => {
              console.log("ID da nota:", params.row.id);
              console.log("nome cliente:", clienteSelecionado?.label);
              navigate("/historico-pag", {
                state: {
                  idNota: params.row.id,
                  idCliente: clienteSelecionado?.value,
                  nomeCliente: clienteSelecionado?.label,
                },
              });
            }}
          />
        </Container>
      </div>
    </>
  );
}
