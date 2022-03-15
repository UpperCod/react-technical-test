import { useEffect, useState } from "react";
import { Input, Button } from "../../components/components";
import "./Login.css";

export function Login(props: { endpoint: string }) {
  const [form, setForm] = useState({ user: "", password: "" });
  const [data, setData] = useState<{ user: string; password: string }>();

  useEffect(() => {
    fetch(props.endpoint, {
      headers: { "Content-Type": "application/json" },
      method: "post",
      body: JSON.stringify(data),
    }).then((res) => {
      console.log(res);
    });
  }, [data]);

  const disabled = !!data;

  return (
    <div className="Login">
      <h3>Login</h3>
      <Input
        disabled={disabled}
        value={form.user}
        type="text"
        name="user"
        placeholder="user"
        onChange={({ target }) => {
          setForm({
            ...form,
            [target.name]: target.value,
          });
        }}
      ></Input>
      <Input
        disabled={disabled}
        type="password"
        name="password"
        value={form.password}
        placeholder="password"
        onChange={({ target }) => {
          setForm({
            ...form,
            [target.name]: target.value,
          });
        }}
      ></Input>
      <Button
        disabled={disabled}
        onClick={() => {
          setData({
            user: form.user,
            password: form.password,
          });
        }}
      >
        Sign in
      </Button>
    </div>
  );
}
