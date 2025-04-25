import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CriarNota from "./pages/CriarNota";
import RegistroCliente from "./pages/RegistroCliente";
import VerClientes from "./pages/VerClientes";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/criar-nota" element={<CriarNota />} />
      <Route path="/registro-cliente" element={<RegistroCliente />} />
      <Route path="/ver-clientes" element={<VerClientes />} />
    </Routes>
  );
}

export default AppRoutes;
