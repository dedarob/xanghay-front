import { Controller, useForm } from "react-hook-form";
import Container from "../../components/Container";
import DinheiroInput from "../../components/DinheiroInput";
import Header from "../../components/Header";
import { IoIosSave } from "react-icons/io";
import styles from "./EditarBoletos.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function EditarBoletos() {
  const { register, handleSubmit, control, setValue } = useForm();
  const [dadosFormulario, setDadosFormulario] = useState(null);
  const { idBoleto } = useParams();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_KEY}/boletos/${idBoleto}`)
      .then((res) => {
        setDadosFormulario(res.data);
        setValue("descricao", res.data.descricao);
        setValue("dataVencimento", res.data.dataVencimento);
        setValue("situacao", res.data.situacao);
        setValue("valor", res.data.valor);
        setValue("observacoes", res.data.observacoes);
        setValue("dataPagamento", res.data.dataPagamento);
        setValue("banco", res.data.banco);
      })
      .catch((err) => console.log(err));
  }, [idBoleto, setValue]);

  const onSubmit = (data) => {
    const boletoDTO = {
      descricao: data.descricao,
      dataVencimento: data.dataVencimento,
      situacao: data.situacao,
      valor: data.valor,
      observacoes: data.observacoes,
      dataPagamento: data.dataPagamento,
      banco: data.banco,
    };

    axios
      .put(`${import.meta.env.VITE_BACKEND_KEY}/boletos/${idBoleto}`, boletoDTO)
      .then((res) => {
        console.log("Atualizado com sucesso", res.data);
        alert("Boleto alterado com sucesso");
      })
      .catch((err) => {
        console.error("Erro ao atualizar boleto", err);
        alert("Erro ao alterar boleto");
      });
  };

  if (!dadosFormulario) return <p>Carregando...</p>;

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
              <option value="pago">Pago</option>
              <option value="atrasado">Atrasado</option>
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
