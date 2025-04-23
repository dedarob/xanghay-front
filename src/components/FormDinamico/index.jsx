import { useFieldArray } from "react-hook-form";
import styles from "./FormDinamico.module.css";
import { FaTrash } from "react-icons/fa";
import { HiPlusSm } from "react-icons/hi";
import { Controller } from "react-hook-form";
import DinheiroInput from "../DinheiroInput";

function FormDinamico({ control, register }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "arrayNota",
  });
  return (
    <>
      {fields.map((field, index) => (
        <tr key={field.id} className={styles.linhaEscrita}>
          <td>
            <input {...register(`arrayNota.${index}.quantidade`)} />
          </td>
          <td>
            <input {...register(`arrayNota.${index}.produto`)} />
          </td>
          <td>
            <Controller
              control={control}
              name={`arrayNota.${index}.valorUni`}
              render={({ field }) => (
                <DinheiroInput
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />
          </td>
          <td>
            <Controller
              control={control}
              name={`arrayNota.${index}.valorTotal`}
              render={({ field }) => (
                <DinheiroInput
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />
          </td>
          <td>
            <button
              className={styles.botaoRemover}
              type="button"
              onClick={() => remove(index)}
            >
              <FaTrash />
            </button>
          </td>
        </tr>
      ))}
      <tr>
        <td colSpan="5">
          <button
            className={styles.botaoAddLinha}
            type="button"
            onClick={() =>
              append({
                quantidade: "",
                produto: "",
                valorUni: "",
                valorTotal: "",
              })
            }
          >
            <HiPlusSm />
          </button>
        </td>
      </tr>
    </>
  );
}

export default FormDinamico;
