import { Link } from "react-router-dom";
import { MdManageAccounts } from "react-icons/md";
import styles from "./Header.module.css";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaAddressBook } from "react-icons/fa";
function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logotipo}>
        <Link to="/">
          <MdManageAccounts /> Xanghay
        </Link>
        <div className={styles.parteIcones}>
          <div className={styles.iconWrapper}>
            <Link to="/registro-cliente" className={styles.iconLink}>
              <FaAddressBook />
            </Link>
            <span className={styles.tooltip}>Registrar novo cliente</span>
          </div>
          <div className={styles.iconWrapper}>
            <Link to="/add-pag" className={styles.iconLink}>
              <FaMoneyBillTrendUp />
            </Link>
            <span className={styles.tooltip}>Adicionar pagamento de nota</span>
          </div>
          <div className={styles.iconWrapper}>
            <Link to="/ver-clientes" className={styles.iconLink}>
              <FaPeopleGroup />
            </Link>
            <span className={styles.tooltip}>Ver lista de clientes</span>
          </div>
        </div>
      </div>
      <nav className={styles.navLinks}>
        <Link to="/ver-boleto">Ver Boletos</Link>
        <Link to="/add-boleto">Adicionar Boleto</Link>

        <Link to="/notas">Ver Notas</Link>
        <Link to="/criar-nota">Criar Nota</Link>
      </nav>
    </header>
  );
}

export default Header;
