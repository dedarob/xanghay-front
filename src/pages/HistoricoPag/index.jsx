import { useEffect, useState } from "react";

import Container from "../../components/Container";
import DinheiroInput from "../../components/DinheiroInput";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import SelectBox from "../../components/SelectBox";
import Tabela from "../../components/Tabela";
import axios from "axios";
import styles from "./HistoricoPag.module.css";
import { useLocation } from "react-router-dom";
import { formatarDataBrasileira } from "../../components/formatarDataBrasileira";

export default function HistoricoPag() {
  const location = useLocation();
  const idNota = location.state?.idNota;
  const idCliente = location.state?.idCliente;
  const nomeCliente = location.state?.nomeCliente;
  const [txtId, setTxtId] = useState();
  const [txtCliente, setTxtCliente] = useState();
  const columns = [
    { field: "idNota", headerName: "ID Nota", width: 70 },
    {
      field: "id", // esse id agora representa o pagamento
      headerName: "ID Pagamento",
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
      headerName: "Data Do Pagamento",
      width: 150,
      renderCell: (params) => (
        <span>{formatarDataBrasileira(params.value)}</span>
      ),
    },
    {
      field: "valorPag",
      headerName: "Valor Do Pagamento",
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
      headerName: "Valor Restante No Momento",
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

  // /aquiroberto

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
    if (!idCliente) return;

    const fetchNotas = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_KEY}/pagamentos/sortado/${idCliente}`
        );
        const data = res.data;

        const payloadFiltrado = data
          .filter((item) => !idNota || item.idNota === idNota)
          .map((item) => ({
            id: item.idPagamento,
            idNota: item.idNota,
            dataEmissao: item.dataNota,
            nomeCliente: item.nomeCliente,
            valorTotal: item.valorDebito,
            ultimoPagamentoData: item.dataPagamento,
            valorPag: item.valorPago,
            situacao: item.situacao,
            resto: item.valorRestanteDebito,
          }));

        setNotasSortadas(payloadFiltrado);
        setTxtId(idNota);
        setTxtCliente(nomeCliente);
        console.log(txtCliente);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotas();
  }, [idCliente, idNota, nomeCliente]);

  return (
    <>
      <Header />
      <div className={styles.bordaVerde}>
        <Container>
          <Link to={"/notas"}>Clique para voltar a visualização de notas</Link>
          <h1 style={{ color: "saddlebrown" }}>
            Visualizando Pagamentos Por Nota
          </h1>
          <label htmlFor="">Mostrando nota ID: {txtId}</label>
          <label htmlFor="">do cliente: {txtCliente}</label>
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
