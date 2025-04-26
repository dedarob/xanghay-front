import Tabela from "../../components/Tabela";
import Header from "../../components/Header";

function Debitos() {
  const rows = [
    { id: 1, name: "Data Grid", description: "the Community version" },
    { id: 2, name: "Data Grid Pro", description: "the Pro version" },
    { id: 3, name: "Data Grid Premium", description: "the Premium version" },
    { id: 4, name: "Data Grid Premium", description: "the Premium version" },
    { id: 5, name: "Data Grid Premium", description: "the Premium version" },
  ];

  const columns = [
    { field: "name", headerName: "Product Name", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
  ];
  return (
    <>
      <Header />
      <Tabela columns={columns} rows={rows} />
    </>
  );
}
export default Debitos;
