import { useEffect, useState } from "react";

import { BotaoVoltar } from "../../components/Container";
import Container from "../../components/Container";
import DinheiroInput from "../../components/DinheiroInput";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import SelectBox from "../../components/SelectBox";
import Tabela from "../../components/Tabela";
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
    const pageWidth = 210;
    let y = 15;

    doc.setFontSize(18);
    doc.text("Relatório Financeiro de Notas", pageWidth / 2, y, {
      align: "center",
    });
    y += 10;

    if (clienteSelecionado && clienteSelecionado.label) {
      doc.setFontSize(12);
      doc.text(`Cliente: ${clienteSelecionado.label}`, 10, y);
      y += 8;
    }

    // Cabeçalho da tabela
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("ID", 10, y);
    doc.text("Emissão", 22, y);
    doc.text("Valor", 48, y);
    doc.text("Últ. Pag.", 70, y);
    doc.text("Pago", 100, y);
    doc.text("Restante", 125, y);
    doc.text("Situação", 155, y);
    doc.setFont(undefined, "normal");
    y += 6;
    doc.line(10, y, 200, y);
    y += 4;

    notasSortadas.forEach((nota) => {
      if (y > 280) {
        doc.addPage();
        y = 15;
      }
      doc.text(String(nota.id), 10, y);
      doc.text(
        nota.dataEmissao
          ? String(nota.dataEmissao).split("-").reverse().join("/")
          : "-",
        22,
        y
      );
      doc.text(
        `R$ ${Number(nota.valorTotal).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
        48,
        y
      );
      doc.text(
        nota.ultimoPagamentoData
          ? String(nota.ultimoPagamentoData).split("-").reverse().join("/")
          : "-",
        70,
        y
      );
      doc.text(
        `R$ ${Number(nota.valorPag).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
        100,
        y
      );
      doc.text(
        `R$ ${Number(nota.resto).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
        125,
        y
      );
      let cor = "black";
      if (nota.situacao === "PAGO") cor = "green";
      else if (nota.situacao === "PARCIALMENTE PAGO") cor = "blue";
      else if (nota.situacao === "EM ABERTO") cor = "red";
      doc.setTextColor(cor);
      doc.text(String(nota.situacao), 155, y);
      doc.setTextColor("black");
      y += 7;
    });

    y += 5;
    // Totalizador
    const totalNotas = notasSortadas.reduce(
      (acc, n) => acc + (Number(n.valorTotal) || 0),
      0
    );
    const totalRestante = notasSortadas.reduce(
      (acc, n) => acc + (Number(n.resto) || 0),
      0
    );
    doc.setFont(undefined, "bold");
    doc.text(
      `Total Notas: R$ ${totalNotas.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      10,
      y
    );
    doc.text(
      `Total Restante: R$ ${totalRestante.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      80,
      y
    );
    doc.setFont(undefined, "normal");

    doc.save(
      `relatorio-financeiro-${
        clienteSelecionado
          ? clienteSelecionado.label.replace(/\s+/g, "-")
          : "todas"
      }.pdf`
    );
  }

  return (
    <>
      <Header />
      <BotaoVoltar />
      <button
        onClick={handleGerarRelatorioPDF}
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
        Gerar Relatório PDF
      </button>
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
