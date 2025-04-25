import { Link } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <Link to="/criar-nota">
        <span>Xanghay</span>
      </Link>
      <nav>
        <Link to="/registro-cliente"> registro</Link>
      </nav>
      <nav>
        <Link to="/ver-clientes"> vercliente</Link>
      </nav>
    </header>
  );
}

export default Header;
