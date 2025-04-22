import { useFieldArray } from "react-hook-form";
import styles from "./FormDinamico.module.css";
import { FaTrash } from "react-icons/fa";
import { HiPlusSm } from "react-icons/hi";

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
            <input {...register(`arrayNota.${index}.valorUni`)} />
          </td>
          <td>
            <input {...register(`arrayNota.${index}.valorTotal`)} />
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
