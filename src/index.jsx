import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./popup/popup";

// ✅ Mount the popup to the root div in popup.html
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
