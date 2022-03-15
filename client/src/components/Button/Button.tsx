import { MouseEventHandler } from "react";
import "./Button.css";

export function Button(props: {
  children: string;
  disabled?: boolean;
  onClick: MouseEventHandler;
}) {
  return (
    <button
      className="Button"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
