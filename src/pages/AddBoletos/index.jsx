import { Controller, useForm } from "react-hook-form";

import Container from "../../components/Container";
import DinheiroInput from "../../components/DinheiroInput";
import Header from "../../components/Header";
import { IoIosSave } from "react-icons/io";
import styles from "./AddBoletos.module.css";
import { useRef } from "react";

export default function AddBoletos() {
  const { register, handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    // Como anexo é file, vamos extrair só o nome para simplificar no console
    if (data.anexo && data.anexo.length > 0) {
      data.anexo = data.anexo[0].name;
    }
    console.log("Dados do boleto:", data);
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
                const inputRef = useRef();

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
