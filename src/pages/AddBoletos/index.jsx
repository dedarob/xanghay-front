import { useForm, Controller } from "react-hook-form";

import Container from "../../components/Container";
import DinheiroInput from "../../components/DinheiroInput";
import Header from "../../components/Header";
import { IoIosSave } from "react-icons/io";
import styles from "./AddBoletos.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddBoletos() {
  const navigate = useNavigate();
  const { register, handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    const boletoDTO = {
      descricao: data.descricao,
      dataVencimento: data.data_vencimento,
      situacao: data.situacao,
      valor: data.valor,
      observacoes: data.observacoes,
      dataPagamento: null,
      banco: null,
    };

    axios
      .post(`${import.meta.env.VITE_BACKEND_KEY}/boletos`, boletoDTO, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        alert("Boleto registrado com sucesso");
        navigate("/ver-boleto");
        console.log("Resposta do servidor:", response.data);
      })
      .catch((error) => {
        console.error("Erro ao enviar boleto:", error.message);
        alert("Erro ao enviar boleto");
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
            <input type="date" {...register("data_vencimento")} />

            <label>Situação</label>
            <select {...register("situacao")}>
              <option value="">Selecione</option>
              <option value="pendente">Pendente</option>
              <option value="atrasado">Atrasado</option>
            </select>

            <label>Valor</label>
            <Controller
              control={control}
              name="valor"
              render={({ field }) => (
                <DinheiroInput
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
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
