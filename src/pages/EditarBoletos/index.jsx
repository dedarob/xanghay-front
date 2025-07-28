import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import Container from "../../components/Container";
import DinheiroInput from "../../components/DinheiroInput";
import Header from "../../components/Header";
import { IoIosSave } from "react-icons/io";
import axios from "axios";
import styles from "./EditarBoletos.module.css";
import { useParams } from "react-router-dom";

export default function EditarBoletos() {
  const { register, handleSubmit, control, setValue } = useForm();
  const [dadosFormulario, setDadosFormulario] = useState(null);
  const { idBoleto } = useParams();

  const fetchBoleto = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_KEY}/boletos/${idBoleto}`
      );
      setDadosFormulario(res.data);
      setValue("descricao", res.data.descricao);
      setValue("dataVencimento", res.data.dataVencimento);
      setValue("situacao", res.data.situacao);
      setValue("valor", res.data.valor);
      setValue("observacoes", res.data.observacoes);
      setValue("dataPagamento", res.data.dataPagamento);
      setValue("banco", res.data.banco);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBoleto();
  }, []);

  const onSubmit = (data) => {
    const payload = {
      descricao: data.descricao,
      dataVencimento: data.dataVencimento,
      situacao: data.situacao,
      valor: data.valor,
      observacoes: data.observacoes,
      dataPagamento: data.dataPagamento,
      banco: data.banco,
    };

    axios
      .put(`${import.meta.env.VITE_BACKEND_KEY}/boletos/${idBoleto}`, payload)
      .then((response) => {
        alert("Boleto atualizado com sucesso!");
        window.history.back();
        console.log("Resposta do servidor:", response.data);
      })
      .catch((error) => {
        console.error("Erro ao atualizar boleto:", error.message);
      });
  };

  return (
    <>
      <Header />
      <Container>
        <div className={styles.areaFormCliente}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.formCliente}
          >
            <label>Descrição</label>
            <input
              {...register("descricao")}
              placeholder="Descrição do boleto"
            />

            <label>Data de Vencimento</label>
            <input type="date" {...register("dataVencimento")} />

            <label>Situação</label>
            <select {...register("situacao")}>
              <option value="">Selecione</option>
              <option value="pendente">Pendente</option>
              <option value="atrasado">Atrasado</option>
              <option value="pago">Pago</option>
            </select>

            <label>Valor</label>
            <Controller
              control={control}
              name={"valor"}
              render={({ field }) => (
                <DinheiroInput
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />

            <label>Data de Pagamento</label>
            <input type="date" {...register("dataPagamento")} />

            <label>Banco</label>
            <input
              {...register("banco")}
              placeholder="Banco que realizou pagamento"
            />

            <label>Observações</label>
            <textarea {...register("observacoes")} placeholder="Observações" />

            <button type="submit">
              <IoIosSave />
            </button>
          </form>
        </div>
      </Container>
    </>
  );
}
