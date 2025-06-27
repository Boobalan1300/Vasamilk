import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import './index.css';

import App from "./App.tsx";
import { UserProvider } from "./Context/UserContext.tsx";
import { LoaderProvider } from "./Context/LoaderContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoaderProvider>
    <UserProvider>
      <App />
    </UserProvider>
    </LoaderProvider>
  </StrictMode>
);

// npm install react@18 react-dom@18
