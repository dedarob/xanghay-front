import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { MdManageAccounts } from "react-icons/md";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logotipo}>
        <Link to="/criar-nota">
          <MdManageAccounts /> Xanghay
        </Link>
      </div>
      <nav className={styles.navLinks}>
        <Link to="/registro-cliente">registro</Link>
        <Link to="/ver-clientes">vercliente</Link>
        <Link to="/debitos">debitos</Link>
      </nav>
    </header>
  );
}

export default Header;
