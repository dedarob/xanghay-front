import styles from "./CriarNota.module.css";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import FormDinamico from "../../components/FormDinamico";
import { PiFilePdf } from "react-icons/pi";

function CriarNota() {
  const { register, handleSubmit, control } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <>
      <Header />
      <span>Tabela de Serviços</span>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.CriarNota}>
          <label htmlFor="nomeCliente">Nome do Cliente</label>
          <input
            className={styles.preencherDadosCliente}
            {...register("nomeCliente")}
          />
          <label htmlFor="enderecoCliente">Endereco</label>
          <input
            className={styles.preencherDadosCliente}
            {...register("enderecoCliente")}
          />
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
            <tbody>
              <FormDinamico control={control} register={register} />
            </tbody>
          </table>
        </div>

        <button type="submit" className={styles.botaoGerarNota}>
          <PiFilePdf />
        </button>
      </form>
    </>
  );
}

export default CriarNota;
