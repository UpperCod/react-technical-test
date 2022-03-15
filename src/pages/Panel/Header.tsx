import { MouseEventHandler } from "react";
import { Button } from "../../components/components";

export function Header(props: { onCreate: MouseEventHandler }) {
  return (
    <header className="Panel-header">
      <div className="Panel-row-inline">
        <h1>Panel</h1>
        <Button onClick={props.onCreate}>➕ Add item</Button>
      </div>
    </header>
  );
}
