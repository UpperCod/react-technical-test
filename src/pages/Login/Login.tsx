import { useEffect, useState } from "react";
import { Input, Button } from "../../components/components";
import "./Login.css";

const defaultForm = () => ({ user: "demo", password: "demo" });

interface Form {
  user: string;
  password: string;
}

export function Login(props: {
  endpoint: string;
  onSuccess: (data: { token: string }) => any;
  onError: (error: any) => any;
}) {
  const [form, setForm] = useState(defaultForm);
  const [data, setData] = useState<Form>();

  const check = (form: Form) => !form.user.trim() || !form.password.trim();

  useEffect(() => {
    if (check(form)) return;

    let cancel: boolean;

    fetch(props.endpoint, {
      headers: { "Content-Type": "application/json" },
      method: "post",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (cancel) return;
        if (res.token) {
          props.onSuccess(res);
        } else {
          props.onError(res);
        }
        setData(defaultForm);
      });
    () => {
      cancel = true;
    };
  }, [data]);

  const disabled = !!data;

  return (
    <div className="Login">
      <div className="Login-form">
        <h3>Login</h3>
        <Input
          disabled={disabled}
          value={form.user}
          type="text"
          name="user"
          placeholder="user"
          onChange={({ target }) =>
            setForm({
              ...form,
              [target.name]: target.value,
            })
          }
        ></Input>
        <Input
          disabled={disabled}
          type="password"
          name="password"
          value={form.password}
          placeholder="password"
          onChange={({ target }) =>
            setForm({
              ...form,
              [target.name]: target.value,
            })
          }
        ></Input>
        <Button
          disabled={disabled}
          onClick={() => {
            if (check(form)) return;
            setData({
              user: form.user,
              password: form.password,
            });
          }}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
}
