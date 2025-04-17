import { useForm, useFieldArray } from "react-hook-form";

function FormDinamico() {
  const { control, register } = useForm();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormProvider)
      name: "arrayNota",
      // unique name for your Field Array
    }
  );

  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id} className={styles.linhaDaNota}>
          <input
            placeholder="Quantidade"
            {...register(`arrayNota.${index}.quantidade`)}
          />
          <input
            placeholder="Produto"
            {...register(`arrayNota.${index}.produto`)}
          />
          <input
            placeholder="Valor Unitário"
            {...register(`arrayNota.${index}.valorUni`)}
          />
          <input
            placeholder="Valor Total"
            {...register(`arrayNota.${index}.valorTotal`)}
          />
          <button
            type="button"
            onClick={() => append({ firstName: "bill", lastName: "luo" })}
          >
            Append
          </button>
        </div>
      ))}
    </>
  );
}

export default FormDinamico;
