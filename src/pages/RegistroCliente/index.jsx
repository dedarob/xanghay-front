import { Controller, useForm } from "react-hook-form";

import Container from "../../components/Container";
import Header from "../../components/Header";
import { IoIosSave } from "react-icons/io";
import TelefoneInput from "../../components/TelefoneInput";
import { fetch } from "./service";
import styles from "./RegistroCliente.module.css";
import { useNavigate } from "react-router-dom";

export default function RegistroCliente() {
  const navigate = useNavigate();
  const { register, handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    fetch(data, navigate);
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
            <label htmlFor=""> Nome do Cliente </label>
            <input
              {...register("nomeCliente")}
              placeholder="Insira nome aqui"
            />
            <label htmlFor="">Cidade</label>
            <input
              {...register("cidadeCliente")}
              placeholder="Insira cidade aqui"
            />
            <label htmlFor="">Endereço</label>
            <input
              {...register("enderecoClienteRegistro")}
              placeholder="Insira endereço aqui"
            />
            <label htmlFor="">Telefone</label>
            <Controller
              name={"telefoneCliente"}
              control={control}
              render={({ field: { onChange, value } }) => (
                <TelefoneInput onValueChange={onChange} value={value} />
              )}
            />

            <button type="submit">
              <IoIosSave />
            </button>
          </form>
        </div>
      </Container>
    </>
  );
}
