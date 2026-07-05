import React from "react";
import ReactDOM from "react-dom/client";
import "@xyflow/react/dist/style.css";
import "./index.css";
// Demo mock (multi-marca: Puig, EstelarBet, Copec…) — es el entrypoint canónico.
import App from "./App";
// Sigma externo en vivo (SSO al backend real). Para volver a él, renderiza <SigmaApp/>.
// import { SigmaApp } from "./live/SigmaApp";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
