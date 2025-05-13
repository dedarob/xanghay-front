import React from "react";
import Select from "react-select";

export default function SelectBox({ options, isSearchable, onChange, value }) {
  return (
    <Select
      options={options}
      isSearchable={isSearchable}
      onChange={onChange} // Corrigido aqui
      value={value}
    />
  );
}
