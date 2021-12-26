import { UserContext } from "../context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/login`, {
        email,
        password,
      });

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        setEmail("");
        setPassword("");
        setState({
          user: data.user,
          jwtToken: data.jwtToken,
        });

        window.localStorage.setItem("user_details", JSON.stringify(data));
        setLoading(false);
      }
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

        <div className="row">
          <div className="col">
            <p className="text-center">
              Create a new account&nbsp;
              <Link href="/register">
                <a>Register</a>
              </Link>
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p className="text-center">
              <Link href="/forgot_password">
                <a>Forgot Password</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
