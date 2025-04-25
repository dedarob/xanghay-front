import styles from "./VerClientes.module.css";
import Header from "../../components/Header";
import Tabela from "../../components/Tabela";
import Container from "../../components/Container";

const rows = [
  { id: 1, name: "Data Grid", description: "the Community version" },
  { id: 2, name: "Data Grid Pro", description: "the Pro version" },
  { id: 3, name: "Data Grid Premium", description: "the Premium version" },
];

const columns = [
  { field: "name", headerName: "Product Name", width: 200 },
  { field: "description", headerName: "Description", width: 300 },
];

function VerClientes() {
  return (
    <>
      <Header />
      <Container>
        <div className={styles.viewVerClientes}>
          <Tabela columns={columns} rows={rows} />
        </div>
      </Container>
    </>
  );
}
export default VerClientes;
