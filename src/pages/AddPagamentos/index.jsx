import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Header from "../../components/Header";
import Container from "../../components/Container";
import styles from "./AddPagamentos.module.css";
import { Controller } from "react-hook-form";
import { IoIosSave } from "react-icons/io";
import SelectBox from "../../components/SelectBox";
import axios from "axios";
import DinheiroInput from "../../components/DinheiroInput";
import { FaInfo } from "react-icons/fa";

export default function AddPagamentos() {
  const { handleSubmit, control, register } = useForm();
  const [comboBox, setComboBox] = useState([]);
  const onSubmit = (data) => {
    console.log("enviado para bda", data);
  };
  const payload = {};
  const [metodoPag, setMetodoPag] = useState();
  useEffect(() => {
    console.log(metodoPag);
  }, [metodoPag]);
  const metodosDePagamento = [
    { value: "pix", label: "Pix" },
    { value: "dinheiro", label: "Dinheiro" },
    { value: "debito", label: "Débito" },
    { value: "credito", label: "Crédito" },
  ];
  const apiPath = "/cliente";
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
  return (
    <>
      <Header />
      <Container>
        <div className={styles.areaFormPagamentos}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.formPagamentos}
          >
            <label htmlFor=""> Nome do Cliente </label>
            <Controller
              control={control}
              name={"cliente"}
              render={({ field }) => (
                <SelectBox
                  options={comboBox}
                  isSearchable={true}
                  onChange={(selected) => {
                    field.onChange(selected);
                  }}
                  value={field.value}
                  placeholder="Clique para pesquisar o cliente"
                />
              )}
            />
            <label htmlFor="">
              <FaInfo />
              Pagamento será aplicado as notas em aberto mais antigas do cliente
            </label>
            <label htmlFor="">Selecione o método de pagamento</label>
            <Controller
              control={control}
              name={"metodoDePagamentoSelect"}
              render={({ field }) => (
                <SelectBox
                  options={metodosDePagamento}
                  isSearchable={true}
                  onChange={(selected) => {
                    field.onChange(selected);
                    setMetodoPag(selected.value);
                  }}
                  value={field.value}
                  placeholder="Clique para pesquisar o cliente"
                />
              )}
            />
            <div className={styles.acaoPagamentos}>
              <label htmlFor="">Valor do Pagamento</label>
              <Controller
                control={control}
                name={"vlrPagamento"}
                render={({ field }) => (
                  <DinheiroInput
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </div>
            <button type="submit" className={styles.botaoSave}>
              <IoIosSave />
            </button>
          </form>
        </div>
      </Container>
    </>
  );
}
