import React from "react";

export default function SelectField({ label, options, value, onChange, required }) {
  return (
    <>
      <label className="form-label">{label}</label>
      <select
        className="form-select mb-4"
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">Select</option>
        {options?.map((item, index) => {
          return (
            <option key={index} value={item}>
              {item}
            </option>
          );
        })}
      </select>
    </>
  );
}
