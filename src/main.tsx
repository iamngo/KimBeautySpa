import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
import { BrowserRouter } from "react-router-dom";
import { BranchProvider } from "./hooks/branchContext";

ReactDOM.render(
  <React.StrictMode>
    <BranchProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </BranchProvider>
  </React.StrictMode>,
  document.getElementById("root")
);