import axios from "axios";
import "./App.css";
import { UserContextProvider } from "./context/UserContext";
import Router from "./Router";

axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Router />
    </UserContextProvider>
  );
}

export default App;
