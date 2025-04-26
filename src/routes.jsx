import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CriarNota from "./pages/CriarNota";
import RegistroCliente from "./pages/RegistroCliente";
import VerClientes from "./pages/VerClientes";
import Debitos from "./pages/Debitos";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/criar-nota" element={<CriarNota />} />
      <Route path="/registro-cliente" element={<RegistroCliente />} />
      <Route path="/ver-clientes" element={<VerClientes />} />
      <Route path="/debitos" element={<Debitos />} />
    </Routes>
  );
}

export default AppRoutes;
