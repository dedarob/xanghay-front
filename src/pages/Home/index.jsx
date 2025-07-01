import styles from "./Home.module.css";
import Header from "../../components/Header";
import Container from "../../components/Container";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const pages = [
    { label: "Criar Nota", path: "/criar-nota" },
    { label: "Registrar Cliente", path: "/registro-cliente" },
    { label: "Ver Clientes", path: "/ver-clientes" },
    { label: "Notas", path: "/notas" },
    { label: "Adicionar Pagamentos", path: "/add-pag" },
    { label: "Ver Pagamento de Notas", path: "/nota-fin" },
    { label: "Histórico Pagamentos", path: "/historico-pag" },
    { label: "Adicionar Boleto", path: "/add-boleto" },
    { label: "Ver Boletos", path: "/ver-boleto" },
  ];

  return (
    <>
      <Header />
      <Container>
        <h1 className={styles.title}>Painel Principal</h1>
        <div className={styles.grid}>
          {pages.map((page, index) => (
            <button
              key={index}
              className={styles.card}
              onClick={() => navigate(page.path)}
            >
              {page.label}
            </button>
          ))}
        </div>
      </Container>
    </>
  );
}

export default Home;
