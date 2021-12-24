import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import axios from "axios";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";

const UserValidation = ({ children }) => {
  const [ok, setOk] = useState(false);
  const router = useRouter();
  const [state] = useContext(UserContext);

  useEffect(() => {
    if (state && state.jwtToken) {
      isAuthorisedUser();
    }
  }, [state && state.jwtToken]);

  const isAuthorisedUser = async () => {
    try {
      const res = await axios.get(`/current-user`);

      if (res.data.ok) {
        setOk(res.data.ok);
      }
    } catch (err) {
      router.push("/login");
    }
  };

  process.browser &&
    state === null &&
    setTimeout(() => {
      isAuthorisedUser();
    }, 1000);

  if (ok) {
    return <>{children}</>;
  } else {
    return (
      <LoadingOutlined className="d-flex justify-content-center display-1 my-5 p-5" />
    );
  }
};

export default UserValidation;
