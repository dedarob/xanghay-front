import { Link } from "react-router-dom";
import styles from "./Header.module.css"


function Header () {
    return (
        <header className={styles.header}>
            <Link to="/home">
            <span>Xanghay</span>            
            </Link>
            <nav>
                teste
            </nav>
        </header>
    )
}

export default Header