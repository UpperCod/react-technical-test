import { Input, Button } from "../../components/components";
import "./Login.css";

export function Login() {
  return (
    <div className="Login">
      <h3>Login</h3>
      <Input type="text"></Input>
      <Input type="password"></Input>
      <Button
        onClick={(event) => {
          console.log(event);
        }}
      >
        click
      </Button>
    </div>
  );
}
