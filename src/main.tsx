import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App
      endpointLogin="/.netlify/functions/login"
      endpointGrud="https://6230a3b1f113bfceed577e7f.mockapi.io/clients"
    />
  </React.StrictMode>,
  document.getElementById("root")
);
