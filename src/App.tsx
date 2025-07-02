import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

import AppRouter from "./Router/MainRouter";
import GlobalLoader from "./SharedComponents/Loader";

function App() {
  return (
    <>
      <GlobalLoader />

      <ToastContainer position="top-right" autoClose={3000} />

      <AppRouter />
    </>
  );
}

export default App;
