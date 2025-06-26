import { Controller, useForm } from "react-hook-form";
import Container from "../../components/Container";
import DinheiroInput from "../../components/DinheiroInput";
import Header from "../../components/Header";
import { IoIosSave } from "react-icons/io";
import styles from "./EditarBoletos.module.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function EditarBoletos() {
  const { register, handleSubmit, control, setValue } = useForm();
  const inputRef = useRef();
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
    const formData = new FormData();

    const boletoDTO = {
      descricao: data.descricao,
      dataVencimento: data.dataVencimento,
      situacao: data.situacao,
      valor: data.valor,
      observacoes: data.observacoes,
      dataPagamento: data.dataPagamento,
      banco: data.banco,
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
      .put(`${import.meta.env.VITE_BACKEND_KEY}/boletos/${idBoleto}`, formData)
      .then((res) => {
        console.log("Atualizado com sucesso", res.data);
      })
      .catch((err) => {
        console.error("Erro ao atualizar boleto", err);
      });
  };

  const baixarAnexo = () => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_KEY}/boletos/anexo/${idBoleto}`, {
        responseType: "blob",
      })
      .then((res) => {
        const disposition = res.headers["content-disposition"];
        let filename = `boleto_${idBoleto}.pdf`;
        if (disposition && disposition.includes("filename=")) {
          filename = disposition
            .split("filename=")[1]
            .replaceAll('"', "")
            .trim();
        }

        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error("Erro ao baixar anexo", err);
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

            <label>Anexo</label>
            <Controller
              name="anexo"
              control={control}
              render={({ field }) => (
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
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        inputRef.current && inputRef.current.click()
                      }
                      className={styles.botaoAnexo}
                    >
                      Enviar novo anexo
                    </button>
                    <button
                      type="button"
                      onClick={baixarAnexo}
                      className={styles.botaoAnexo}
                    >
                      Baixar anexo atual
                    </button>
                  </div>
                  {field.value && field.value.length > 0 && (
                    <span style={{ marginLeft: 10 }}>
                      {field.value[0].name}
                    </span>
                  )}
                </>
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
