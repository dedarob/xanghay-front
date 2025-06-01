import styles from "./Modal.module.css";
import { FaWindowClose } from "react-icons/fa";

const Modal = ({ aberto, onFechar, children }) => {
  if (!aberto) return null;

  return (
    <div className={styles.fundo}>
      <div className={styles.janela}>
        <div className={styles.areaAcao}>
          <button className={styles.botaoFechar} onClick={onFechar}>
            <FaWindowClose />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
