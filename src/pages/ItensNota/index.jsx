import styles from "./ItensNota.module.css";
import Tabela from "../../components/Tabela";
import DinheiroInput from "../../components/DinheiroInput";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ItensNota() {
  const { idNota } = useParams();
  const [itens, setItens] = useState([]);
  const [totalNotaPorObjeto, setTotalNotaPorObjeto] = useState(0);
  const [totalNota, setTotalNota] = useState(0);
  function somaCadaItem(data) {
    let totalItem = 0;
    let totalTodosItens = 0;
    data.forEach((obj, i) => {
      obj.precoTotal = "";
      totalItem = (obj?.precoUnitario || 0) * (obj?.quantidade || 0);
      obj.precoTotal = totalItem;
      setTotalNota((totalTodosItens += obj.precoTotal));
    });
  }
  useEffect(() => {
    if (!idNota) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_KEY}/notas/itens/${idNota}`)
      .then((res) => {
        setItens(res.data);
        somaCadaItem(res.data);
        console.log(res.data);
        console.log(totalNotaPorObjeto);
      })

      .catch((err) => console.log(err));
  }, [idNota]);

  const columns = [
    { field: "id", headerName: "Identificador Nota", width: 130 },
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
  return (
    <>
      <Tabela columns={columns} rows={itens} />
      <DinheiroInput
        className={styles.dinheiroFormatado}
        value={totalNota}
        onValueChange={() => {}}
        disabled={true}
      />
    </>
  );
}

export default ItensNota;
