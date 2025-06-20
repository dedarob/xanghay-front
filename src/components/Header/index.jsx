import { Link } from "react-router-dom";
import { MdManageAccounts } from "react-icons/md";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logotipo}>
        <Link to="/">
          <MdManageAccounts /> Xanghay
        </Link>
      </div>
      <nav className={styles.navLinks}>
        <Link to="/add-boleto">Ver Boletos</Link>
        <Link to="/registro-cliente">Registro</Link>
        <Link to="/ver-clientes">Ver Clientes</Link>
        <Link to="/notas">Ver Notas</Link>
        <Link to="/criar-nota">Criar Nota</Link>
        <Link to="/add-pag">Adicionar Pagamentos</Link>
      </nav>
    </header>
  );
}

export default Header;
