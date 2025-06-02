import { useState, useEffect } from "react";
import styles from "./ConfirmDeleteModal.module.css";
import Modal from "../Modal";

export default function ConfirmDeleteModal({
  aberto,
  onFechar,
  headerMessage,
  onConfirmarDelete,
}) {
  const [codigoConfirmacao, setCodigoConfirmacao] = useState("");
  const [inputConfirmacao, setInputConfirmacao] = useState("");

  useEffect(() => {
    if (aberto) {
      const codigo = Math.floor(100000 + Math.random() * 900000).toString();
      setCodigoConfirmacao(codigo);
      setInputConfirmacao("");
    }
  }, [aberto]);

  return (
    <Modal aberto={aberto} onFechar={onFechar}>
      <div className={styles.areaConfirmDeletar}>
        <h1>{headerMessage}</h1>
        <p>Digite o código abaixo para confirmar a exclusão:</p>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            letterSpacing: "0.3rem",
            marginBottom: "1rem",
            userSelect: "none",
          }}
        >
          {codigoConfirmacao}
        </div>
        <input
          type="text"
          value={inputConfirmacao}
          onChange={(e) => setInputConfirmacao(e.target.value)}
          maxLength={codigoConfirmacao.length}
          placeholder="Digite o código aqui"
        />
        <div className={styles.areaConfirmDeletar}>
          <button
            className={styles.botaoCancelar}
            onClick={onFechar}
            type="button"
          >
            Cancelar Operação
          </button>
          <button
            className={styles.botaoPross}
            onClick={onConfirmarDelete}
            disabled={inputConfirmacao !== codigoConfirmacao}
            type="button"
          >
            Apagar
          </button>
        </div>
      </div>
    </Modal>
  );
}
