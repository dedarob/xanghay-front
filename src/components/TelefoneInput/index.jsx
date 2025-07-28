import { PatternFormat } from "react-number-format";
import styles from "./TelefoneInput.module.css";

function TelefoneInput({
  value,
  onValueChange,
  disabled,
  placeholder,
  className,
}) {
  return (
    <PatternFormat
      value={value}
      onValueChange={(values) => {
        onValueChange(values.value);
      }}
      format="+55 (##) #-####-####"
      allowEmptyFormatting
      mask="_"
      disabled={disabled}
      placeholder={placeholder}
      className={className}
    />
  );
}

export default TelefoneInput;
