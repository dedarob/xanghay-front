import styles from "./CriarNota.module.css";
import Header from "../../components/Header";
import { useForm, useWatch } from "react-hook-form";
import FormDinamico from "../../components/FormDinamico";
import { PiFilePdf } from "react-icons/pi";
import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import DinheiroInput from "../../components/DinheiroInput";
import Container from "../../components/Container";
import SelectBox from "../../components/SelectBox";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CriarNota() {
  const apiPath = "/cliente";
  const navigate = useNavigate();
  const [comboBox, setComboBox] = useState([]);
  const [isSearchable, setIsSearchable] = useState(true);

  const { register, handleSubmit, control, setValue, watch } = useForm();
  const [formData, setFormData] = useState(null);
  const [moneySum, setMoneySum] = useState(0);
  const arrayNotaAtt = useWatch({
    control,
    name: "arrayNota",
  });

  useEffect(() => {
    const fetchComboBoxData = () => {
      axios
        .get(import.meta.env.VITE_BACKEND_KEY + apiPath, {
          params: { returnTypes: "idAndNome" },
        })
        .then(function (response) {
          const data = response.data;
          const mappedData = data.map((item) => ({
            value: item.id,
            label: item.nomeCliente,
          }));
          setComboBox(mappedData);
        })
        .catch((error) => {
          console.log(error.message);
        });
    };

    fetchComboBoxData();
  }, []);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    setFormData(data);
    console.log("Total Geral:", moneySum);
  };

  useEffect(() => {
    if (!arrayNotaAtt || !Array.isArray(arrayNotaAtt)) return;

    let totalGeral = 0;
    arrayNotaAtt.forEach((item, i) => {
      const totalItem = (item?.valorUni || 0) * (item?.quantidade || 0);
      if (item?.valorTotal !== totalItem) {
        setValue(`arrayNota.${i}.valorTotal`, totalItem, { shouldDirty: true });
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
      <Container>
        <span>Tabela de Serviços</span>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.areaForm}>
          <div className={styles.areaDadosCliente}>
            <label htmlFor="nomeCliente">Nome do Cliente</label>

            <Controller
              control={control}
              name={"selectBoxNome"}
              render={({ field }) => (
                <SelectBox
                  className={styles.preencherDadosCliente}
                  options={comboBox}
                  isSearchable={isSearchable}
                />
              )}
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
      </Container>
    </>
  );
}

export default CriarNota;
