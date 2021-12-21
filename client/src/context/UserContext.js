import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import domain from "../util/domain";

const UserContext = createContext();

function UserContextProvider(props) {
  const [Users, setUsers] = useState([]);
  const [User, setUser] = useState();
  const [LoggedUser, setLoggedUser] = useState({
    name: "",
  });

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getLoggedUser();
  }, []);

  async function getUser() {
    const res = await axios.get(`${domain}/auth/log_in`);
    setUser(res.data);
  }

  async function getUsers() {
    const res = await axios.get(`${domain}/auth/`);
    setUsers(res.data);
  }

  async function getLoggedUser() {
    const res = await axios.get(`${domain}/auth/loggedUser`);
    setLoggedUser(res.data);
  }

  return (
    <UserContext.Provider value={{ User, getUser, LoggedUser, Users }}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContext;
export { UserContextProvider };
