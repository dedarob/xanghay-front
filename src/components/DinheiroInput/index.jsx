import styles from "./DinheiroInput.module.css";
import { NumericFormat } from "react-number-format";

function DinheiroInput({ value, onValueChange, disabled, placeholder }) {
  return (
    <NumericFormat
      value={value}
      onValueChange={(values) => {
        const valorNumerico = values.floatValue || 0;
        onValueChange(valorNumerico);
      }}
      thousandSeparator="."
      decimalSeparator=","
      prefix="R$"
      decimalScale={2}
      fixedDecimalScale={true}
      className={styles.inputBoxDinheiro}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
}

export default DinheiroInput;
