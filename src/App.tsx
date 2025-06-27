import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { getUser } from "./Utils/Cookie";
import { useEffect } from "react";
import AppRouter from "./Router/MainRouter";


function App() {
  useEffect(()=>{

    handleGetUser()
  },[])
   const handleGetUser = () => {
      const userCookie = getUser();
      console.log(userCookie?.token)
   }

  return (
    <>
     
      <ToastContainer position="top-right" autoClose={3000} />

      <AppRouter />


    </>
  );
}

export default App;
