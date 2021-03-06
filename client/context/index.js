import { useState, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  //The React useState Hook allows us to track state in a function component
  //useEffect Hooks fire at every render
  const [state, setState] = useState({
    user: {},
    jwtToken: "",
  });

  const router = useRouter();

  //In this way we can wrap our app components inside UserContext
  //children means the home, nav, login... components etc..
  //The user and token variables are now available for the whole app componets

  //Empty array in useEffect means array with no dependancies i.e, the function will trigger exactly once
  useEffect(() => {
    setState(JSON.parse(window.localStorage.getItem("user_details")));
  }, []);

  const token = (state && state.jwtToken) ? state.jwtToken : "";
  axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API}`;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      console.log(error);
      let res = error.response;
      console.log(res);
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        setState(null);
        window.localStorage.removeItem("user_details");
        router.push("/login");
      }
    }
  );

  return (
    <UserContext.Provider value={[state, setState]}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
