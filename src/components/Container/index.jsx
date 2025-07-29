import { IoArrowBack } from "react-icons/io5";
import styles from "./Container.module.css";
import { useNavigate } from "react-router-dom";

function Container({ children }) {
  return <section className={styles.container}>{children}</section>;
}

export function BotaoVoltar({ className = "", children = <IoArrowBack /> }) {
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
