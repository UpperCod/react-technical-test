import { useState } from "react";
import { Login } from "./pages/Login/Login";
import { Panel } from "./pages/Panel/Panel";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>();

  return (
    <div className="App">
      {loggedIn ? (
        <Panel
          token="uppercod-15-03-2022"
          endpoint="https://6230a3b1f113bfceed577e7f.mockapi.io/clients"
          template={[
            { type: "text", name: "name", value: "" },
            { type: "text", name: "business", value: "" },
            { type: "email", name: "email", value: "" },
          ]}
        ></Panel>
      ) : (
        <Login endpoint="http://localhost"></Login>
      )}
    </div>
  );
}

export default App;
