import styles from "./VerBoletos.module.css";
import Tabela from "../../components/Tabela";
import { useEffect, useState } from "react";
import axios from "axios";
import Container from "../../components/Container";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { formatarDataBrasileira } from "../../components/formatarDataBrasileira";

export default function VerBoletos() {
  const navigate = useNavigate();
  const [boletos, setBoletos] = useState([]);
  const columns = [
    { field: "id", headerName: "Identificador Boleto", width: 150 },
    { field: "descricao", headerName: "Descrição", width: 200 },
    {
      field: "dataVencimento",
      headerName: "Data de Vencimento",
      width: 180,
      renderCell: (params) => (
        <span>{formatarDataBrasileira(params.value)}</span>
      ),
    },
    { field: "situacao", headerName: "Situação", width: 120 },
    { field: "valor", headerName: "Valor", width: 120 },
    { field: "observacoes", headerName: "Observações", width: 250 },
    {
      field: "dataPagamento",
      headerName: "Data de Pagamento",
      width: 180,
      renderCell: (params) => (
        <span>{formatarDataBrasileira(params.value)}</span>
      ),
    },
    { field: "banco", headerName: "Banco", width: 150 },
  ];
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_KEY + "/boletos")
      .then((response) => setBoletos(response.data));
  }, []);
  return (
    <>
      <Header />
      <Container>
        <div className={styles.pagBoletos}>
          <div className={styles.areaTitulo}>
            <h2>Boletos</h2>
            <h3>Vendo página das duplicatas da loja</h3>
          </div>
          <Tabela
            columns={columns}
            rows={boletos}
            onRowClick={(params) => {
              navigate(`/editar-boleto/${params.row.id}`);
            }}
          />
        </div>
      </Container>
    </>
  );
}
