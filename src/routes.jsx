import { Route, Routes } from "react-router-dom";

import AddBoletos from "./pages/AddBoletos";
import AddPagamentos from "./pages/AddPagamentos";
import CriarNota from "./pages/CriarNota";
import HistoricoPag from "./pages/HistoricoPag";
import Home from "./pages/Home";
import ItensNota from "./pages/ItensNota";
import NotaFinanceiro from "./pages/NotaFinanceiro";
import Notas from "./pages/Notas";
import RegistroCliente from "./pages/RegistroCliente";
import VerClientes from "./pages/VerClientes";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/criar-nota" element={<CriarNota />} />
      <Route path="/registro-cliente" element={<RegistroCliente />} />
      <Route path="/ver-clientes" element={<VerClientes />} />
      <Route path="/notas" element={<Notas />} />
      <Route path="/itens-nota/:idNota" element={<ItensNota />} />
      <Route path="/add-pag" element={<AddPagamentos />} />
      <Route path="/nota-fin" element={<NotaFinanceiro />} />
      <Route path="/historico-pag" element={<HistoricoPag />} />
      <Route path="/add-boleto" element={<AddBoletos />} />
    </Routes>
  );
}

export default AppRoutes;
