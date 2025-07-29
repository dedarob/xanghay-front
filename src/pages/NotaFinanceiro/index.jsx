import { useEffect, useState } from "react";

import { BotaoVoltar } from "../../components/Container";
import Container from "../../components/Container";
import DinheiroInput from "../../components/DinheiroInput";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { PiFilePdf } from "react-icons/pi";
import SelectBox from "../../components/SelectBox";
import Tabela from "../../components/Tabela";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { formatarDataBrasileira } from "../../components/formatarDataBrasileira";
import jsPDF from "jspdf";
import styles from "./NotaFinanceiro.module.css";
import { useNavigate } from "react-router-dom";

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

  // Função para gerar relatório PDF abrangente
  function handleGerarRelatorioPDF() {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(16);
    doc.text("Relatório Financeiro de Notas", 105, 15, { align: "center" });

    const headers = [
      ["ID", "Emissão", "Valor", "Últ. Pag.", "Pago", "Restante", "Situação"],
    ];

    const data = notasSortadas.map((nota) => [
      nota.id,
      nota.dataEmissao ? nota.dataEmissao.split("-").reverse().join("/") : "-",
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
      startY: 25,
      styles: {
        fontSize: 10,
        lineWidth: 0.2, // bordas finas para todas as células
        lineColor: [0, 0, 0], // bordas pretas
      },
      headStyles: {
        fillColor: [255, 255, 255], // sem cor de fundo no cabeçalho
        textColor: [0, 0, 0], // texto preto
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        halign: "left", // opcional, alinhamento horizontal
        valign: "middle",
      },
      didParseCell: function (data) {
        if (data.column.index === 6) {
          const situacao = data.cell.text[0];
          if (situacao === "PAGO") data.cell.styles.textColor = [0, 128, 0];
          else if (situacao === "PARCIALMENTE PAGO")
            data.cell.styles.textColor = [0, 0, 255];
          else if (situacao === "EM ABERTO")
            data.cell.styles.textColor = [255, 0, 0];
        }
      },
    });

    doc.save("relatorio-financeiro.pdf");
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
              console.log("nome cliente:", clienteSelecionado.label);
              navigate("/historico-pag", {
                state: {
                  idNota: params.row.id,
                  idCliente: clienteSelecionado.value,
                  nomeCliente: clienteSelecionado.label,
                },
              });
            }}
          />
        </Container>
      </div>
    </>
  );
}
