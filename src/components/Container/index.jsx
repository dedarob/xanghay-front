import { useNavigate } from "react-router-dom";
import styles from "./Container.module.css";

function Container({ children }) {
  return <section className={styles.container}>{children}</section>;
}

export function BotaoVoltar({ className = "", children = "Voltar" }) {
  const navigate = useNavigate();
  return (
    <button
      className={`${styles.botaoVoltar} ${className}`}
      onClick={() => navigate(-1)}
      type="button"
    >
      {children}
    </button>
  );
}

export default Container;
