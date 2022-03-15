import { useState } from "react";
import { Login } from "./pages/Login/Login";
import { Panel } from "./pages/Panel/Panel";
import "./App.css";

function App(props: { endpointLogin: string; endpointGrud: string }) {
  const [token, setToken] = useState<string>(
    () => localStorage.getItem("token") || ""
  );
  return (
    <div className="App">
      {token ? (
        <Panel
          token={token}
          endpoint={props.endpointGrud}
          template={[
            { type: "text", name: "name", value: "" },
            { type: "text", name: "business", value: "" },
            { type: "email", name: "email", value: "" },
          ]}
          onLogOut={() => {
            localStorage.setItem("token", "");
            location.reload();
          }}
        ></Panel>
      ) : (
        <Login
          endpoint={props.endpointLogin}
          onSuccess={(data) => {
            localStorage.setItem("token", data.token);
            setToken(data.token);
          }}
          onError={() => {}}
        ></Login>
      )}
    </div>
  );
}

export default App;
