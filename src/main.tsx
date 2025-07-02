import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.tsx";


import { Provider } from "react-redux";
import { store } from "./Store/Store.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
  
      <App />

  </Provider>
);

// npm install react@18 react-dom@18
