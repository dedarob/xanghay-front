import { useEffect, useState } from "react";

import Container from "../../components/Container";
import Header from "../../components/Header";
import SelectBox from "../../components/SelectBox";
import Tabela from "../../components/Tabela";
import axios from "axios";
import styles from "./Notas.module.css";
import { useNavigate } from "react-router-dom";

function Notas() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [notas, setNotas] = useState([]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_KEY + "/cliente", {
        params: { returnTypes: "idAndNome" },
      })
      .then((res) => {
        const mapped = res.data.map((c) => ({
          value: c.id,
          label: c.nomeCliente,
        }));
        setClientes(mapped);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!clienteSelecionado) return;

    axios
      .get(
        `${import.meta.env.VITE_BACKEND_KEY}/notas/detailed/${
          clienteSelecionado.value
        }`
      )
      .then((res) => setNotas(res.data))
      .catch((err) => console.log(err));
  }, [clienteSelecionado]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "dataEmissao", headerName: "Data de Emissão", width: 150 },
    { field: "valorTotal", headerName: "Valor Total", width: 130 },
    { field: "situacao", headerName: "Situação", width: 120 },
  ];

  const onRowClick = (params) => {
    navigate(`/itens-nota/${params.row.id}`);
  };

  return (
    <>
      <Header />
      <Container>
        <div className={styles.areaSelect}>
          <SelectBox
            options={clientes}
            isSearchable={true}
            onChange={setClienteSelecionado}
            value={clienteSelecionado}
            placeholder="Selecione um cliente"
          />
        </div>

        {clienteSelecionado && (
          <div className={styles.areaTabela}>
            <Tabela columns={columns} rows={notas} onRowClick={onRowClick} />
          </div>
        )}
      </Container>
    </>
  );
}

export default Notas;
