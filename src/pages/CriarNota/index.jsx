import styles from "./CriarNota.module.css";
import Header from "../../components/Header";
import { useForm, useWatch } from "react-hook-form";
import FormDinamico from "../../components/FormDinamico";
import { PiFilePdf } from "react-icons/pi";
import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import DinheiroInput from "../../components/DinheiroInput";

function CriarNota() {
  const { register, handleSubmit, control, setValue, watch } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    setFormData(data);
    console.log("soma aqui" + moneySum);
  }; //a partir daqui vamos pro axios

  const [formData, setFormData] = useState(null);
  const [moneySum, setMoneySum] = useState(0);
  const arrayNotaAtt = useWatch({
    control,
    name: "arrayNota",
  });

  useEffect(() => {
    if (!arrayNotaAtt || !Array.isArray(arrayNotaAtt)) return;

    let totalGeral = 0;
    let valoresAtualizados = false;

    arrayNotaAtt.forEach((item, i) => {
      const totalItem = (item?.valorUni || 0) * (item?.quantidade || 0);

      if (item?.valorTotal !== totalItem) {
        setValue(`arrayNota.${i}.valorTotal`, totalItem, { shouldDirty: true });
        valoresAtualizados = true;
      }

      totalGeral += totalItem;
    });

    if (moneySum !== totalGeral) {
      setMoneySum(totalGeral);
      setValue("totalGeral", totalGeral, { shouldDirty: true });
    }
  }, [arrayNotaAtt, setValue, moneySum]);

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
        <div className={styles.areaTotalePDF}>
          <Controller
            className={styles.primeiroElemento}
            control={control}
            name={"totalGeral"}
            render={({ field }) => (
              <DinheiroInput
                value={field.value}
                onValueChange={field.onChange}
                disabled
                placeholder="Total Geral"
              />
            )}
          />
          <button type="submit" className={styles.botaoGerarNota}>
            <PiFilePdf />
          </button>
        </div>
      </form>
    </>
  );
}

export default CriarNota;
