import Container from "../../components/Container";
import { Controller } from "react-hook-form";
import DinheiroInput from "../../components/DinheiroInput";
import { FaInfo } from "react-icons/fa";
import Header from "../../components/Header";
import { IoIosSave } from "react-icons/io";
import SelectBox from "../../components/SelectBox";
import axios from "axios";
import styles from "./AddPagamentos.module.css";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AddPagamentos() {
  const { handleSubmit, control, register } = useForm();
  const [comboBox, setComboBox] = useState([]);
  const onSubmit = (data) => {
    const confirmacao = window.confirm(
      "Tem certeza que deseja adicionar o pagamento?"
    );
    if (!confirmacao) return alert("Pagamento cancelado");
    const hoje = new Date();
    const yyyy = hoje.getFullYear();
    const mm = String(hoje.getMonth() + 1).padStart(2, "0");
    const dd = String(hoje.getDate()).padStart(2, "0");
    const dataLocal = `${yyyy}-${mm}-${dd}`;
    let valorPago = data.vlrPagamento;

    if (typeof valorPago === "string") {
      valorPago = parseFloat(
        valorPago.replace(/[^\d,.-]/g, "").replace(",", ".")
      );
    }

    const payload = {
      dataPagamento: new Date().toISOString().split("T")[0],
      valorPago,
      clienteId: data.cliente?.value,
      metodoPag: data.metodoDePagamentoSelect?.value.toUpperCase(),
    };

    const clienteId = payload.clienteId;

    console.log("enviado para bda", payload);

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_KEY}/pagamentos/${clienteId}`,
        payload
      )
      .then((response) => {
        alert("Pagamento registrado com sucesso");
        console.log("Resposta do servidor:", response.data);
      })
      .catch((error) => {
        console.error("Erro ao enviar pagamento:", error.message);
      });
  };

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
