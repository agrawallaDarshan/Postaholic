import { UserContext } from "../context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("darshan@gmail.com");
  const [password, setPassword] = useState("darshan@react");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`/login`, {
        email,
        password,
      });

      setEmail("");
      setPassword("");
      console.log(res.data.user, res.data.jwtToken);
      setState({
        user: res.data.user,
        jwtToken: res.data.jwtToken,
      });

      window.localStorage.setItem("user_details", JSON.stringify(res.data));

      setOk(res.data.ok);
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state && state.jwtToken) router.push("/user/dashboard");
  });

  return (
    <div className="container-fluid">
      <div className="row bg-dark text-light py-3">
        <div className="col text-center">
          <h1 style={{ color: "white" }}>Login</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 offset-md-3">
          <AuthForm
            handleSubmit={handleSubmit}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            page="login"
          />
        </div>

        <div className="row my-3">
          <div className="col">
            <p className="text-center">
              Create a new account&nbsp;
              <Link href="/register">
                <a>Register</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
