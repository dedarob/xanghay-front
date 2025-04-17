import styles from "./CriarNota.module.css";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import FormDinamico from "../../components/FormDinamico";

function CriarNota() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <>
      <Header />
      <span>Tabela de Serviços</span>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.CriarNota}>
          <label htmlFor="nomeCliente">Nome do Cliente</label>
          <input {...register("nomeCliente")} />
        </div>
        <div>
          <label htmlFor="enderecoCliente">Endereco</label>
          <input {...register("enderecoCliente")} />
        </div>
        <div>
          <table className={styles.tabela_criar_nota}>
            <thead className={styles.thead_criar_nota}>
              <tr className={styles.tr_criar_nota}>
                <th className={styles.th_criar_nota}>Quantidade</th>
                <th className={styles.th_criar_nota}>Produto/Serviço</th>
                <th className={styles.th_criar_nota}>Valor Unitário</th>
                <th className={styles.th_criar_nota}>Valor Total</th>
                <th className={styles.th_criar_nota}>Ação</th>
              </tr>
            </thead>
          </table>
        </div>
        <FormDinamico />
        <button>Adicionar Linha</button>
        <button>Gerar Nota</button>
      </form>
    </>
  );
}

export default CriarNota;
