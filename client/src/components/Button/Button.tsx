import { MouseEventHandler } from "react";
import "./Button.css";

export function Button(props: {
  children: string;
  onClick: MouseEventHandler;
}) {
  return (
    <button className="Button" onClick={props.onClick}>
      {props.children}
    </button>
  );
}
