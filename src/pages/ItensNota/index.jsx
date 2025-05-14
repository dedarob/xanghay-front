import styles from "./ItensNota.module.css";
import Tabela from "../../components/Tabela";
import DinheiroInput from "../../components/DinheiroInput";

function ItensNota() {
  const columns = [
    { field: "id", headerName: "Identificador Nota", width: 100 },
    { field: "dataEmissao", headerName: "Produto/Serviço", width: 180 },
    { field: "idCliente", headerName: "Quantidade", width: 120 },
    {
      field: "nomeCliente",
      headerName: "Preco Unitario",
      width: 200,
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
  return <Tabela columns={columns} rows={notas} />;
}

export default ItensNota;
