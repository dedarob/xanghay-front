import { Controller, useForm } from "react-hook-form";

import Container from "../../components/Container";
import DinheiroInput from "../../components/DinheiroInput";
import Header from "../../components/Header";
import { IoIosSave } from "react-icons/io";
import styles from "./AddBoletos.module.css";
import { useRef } from "react";
import axios from "axios";

export default function AddBoletos() {
  const { register, handleSubmit, control } = useForm();
  const inputRef = useRef();
  const onSubmit = (data) => {
    const formData = new FormData();

    const boletoDTO = {
      descricao: data.descricao,
      dataVencimento: data.data_vencimento,
      situacao: data.situacao,
      valor: data.valor,
      observacoes: data.observacoes,
      dataPagamento: null,
      banco: null,
    };

    formData.append(
      "boleto",
      new Blob([JSON.stringify(boletoDTO)], {
        type: "application/json",
      })
    );

    if (data.anexo && data.anexo.length > 0) {
      formData.append("anexo", data.anexo[0]);
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_KEY}/boletos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Boleto registrado com sucesso");
        console.log("Resposta do servidor:", response.data);
      })
      .catch((error) => {
        console.error("Erro ao enviar pagamento:", error.message);
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
            <label htmlFor="">Descrição</label>
            <input
              {...register("descricao")}
              placeholder="Descrição do boleto"
            />

            <label htmlFor="">Data de Vencimento</label>
            <input type="date" {...register("data_vencimento")} />

            <label htmlFor="">Situação</label>
            <select {...register("situacao")}>
              <option value="">Selecione</option>
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="atrasado">Atrasado</option>
            </select>

            <label htmlFor="">Valor</label>
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
            <label htmlFor="">Anexo</label>
            <Controller
              name="anexo"
              control={control}
              render={({ field }) => {
                return (
                  <>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      ref={(e) => {
                        inputRef.current = e;
                        field.ref(e);
                      }}
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        inputRef.current && inputRef.current.click()
                      }
                      className={styles.botaoAnexo}
                    >
                      Selecionar arquivo
                    </button>
                    {field.value && field.value.length > 0 && (
                      <span style={{ marginLeft: 10 }}>
                        {field.value[0].name}
                      </span>
                    )}
                  </>
                );
              }}
            />
            <label htmlFor="">Observações</label>
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
