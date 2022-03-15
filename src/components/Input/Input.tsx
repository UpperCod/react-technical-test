import { ChangeEvent } from "react";
import "./Input.css";

export function Input(props: {
  type: string;
  disabled?: boolean;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => any;
}) {
  return (
    <input
      type={props.disabled ? "text" : props.type}
      className="Input"
      disabled={props.disabled}
      value={props.value}
      name={props.name}
      placeholder={props.placeholder || props.name + "?"}
      onChange={props.onChange}
    />
  );
}
