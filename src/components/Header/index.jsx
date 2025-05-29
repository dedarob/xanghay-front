import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { MdManageAccounts } from "react-icons/md";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logotipo}>
        <Link to="/">
          <MdManageAccounts /> Xanghay
        </Link>
      </div>
      <nav className={styles.navLinks}>
        <Link to="/registro-cliente">Registro</Link>
        <Link to="/ver-clientes">Ver Clientes</Link>
        <Link to="/notas">Ver Notas</Link>
        <Link to="/criar-nota">Criar Nota</Link>
      </nav>
    </header>
  );
}

export default Header;
