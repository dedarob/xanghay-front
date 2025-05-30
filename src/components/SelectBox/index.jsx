import React from "react";
import Select from "react-select";

export default function SelectBox({
  options,
  isSearchable,
  onChange,
  value,
  placeholder,
}) {
  return (
    <Select
      options={options}
      isSearchable={isSearchable}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
    />
  );
}
