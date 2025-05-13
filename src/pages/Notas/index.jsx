import { useState, useEffect } from "react";
import SelectBox from "../../components/SelectBox";
import axios from "axios";
import Tabela from "../../components/Tabela";
import Header from "../../components/Header";
import Container from "../../components/Container";
import styles from "./Notas.module.css";

function Notas() {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [notas, setNotas] = useState([]);

  const columns = [
    { field: "id", headerName: "ID Nota", width: 100 },
    { field: "dataEmissao", headerName: "Data de Emissão", width: 180 },
    { field: "idCliente", headerName: "ID Cliente", width: 120 },
    { field: "nomeCliente", headerName: "Nome Cliente", width: 200 },
    { field: "valorTotal", headerName: "Valor Total", width: 150 },
  ];

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

  return (
    <>
      <Header />
      <Container>
        <h2>Notas por Cliente</h2>
        <SelectBox
          options={clientes}
          isSearchable={true}
          onChange={setClienteSelecionado}
          value={clienteSelecionado}
        />
        <div className={styles.viewVerClientes}>
          <Tabela columns={columns} rows={notas} />
        </div>
      </Container>
    </>
  );
}

export default Notas;
