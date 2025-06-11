import Container from "../../components/Container";
import Header from "../../components/Header";
import styles from "./NotaFinanceiro.module.css";
import Tabela from "../../components/Tabela";
import DinheiroInput from "../../components/DinheiroInput";
import { Link } from "react-router-dom";
import SelectBox from "../../components/SelectBox";
import { useState, useEffect } from "react";
import axios from "axios";

export default function NotaFinanceiro() {
  const columns = [
    { field: "id", headerName: "ID Nota", width: 70 },
    { field: "idPagamento", headerName: "ID Pagamento", width: 70 },
    { field: "dataEmissao", headerName: "Data de Emissão", width: 150 },
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
          case "Pago":
            cor = "green";
            break;
          case "Parcialmente Pago":
            cor = "blue";
            break;
          case "Em Aberto":
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

  return (
    <>
      <Header />
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
          />
        </Container>
      </div>
    </>
  );
}
