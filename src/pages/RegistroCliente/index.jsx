import { useForm, Controller } from "react-hook-form";
import styles from "./RegistroCliente.module.css";
import Header from "../../components/Header";
import TelefoneInput from "../../components/TelefoneInput";
import { IoIosSave } from "react-icons/io";
import { CgController } from "react-icons/cg";
import Container from "../../components/Container";

function RegistroCliente() {
  const { register, handleSubmit, control } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    //colocar o que acontece ao apertar botao de submit
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
export default RegistroCliente;
