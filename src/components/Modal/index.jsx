import styles from "./Modal.module.css";
import { FaWindowClose } from "react-icons/fa";

const Modal = ({ aberto, onFechar, children, className }) => {
  if (!aberto) return null;

  return (
    <div className={styles.fundo}>
      <div className={`${styles.janela} ${className || ""}`}>
        <div className={styles.areaAcao}>
          <button className={styles.botaoFechar} onClick={onFechar}>
            <FaWindowClose />
          </button>
        </div>
        <div className={styles.conteudoModal}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
