import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";

const forgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [security, setSecurity] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/forgot-password", {
        email,
        newPassword,
        newPasswordAgain,
        securityQuestion,
        security,
      });

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        setEmail("");
        setNewPassword("");
        setNewPasswordAgain("");
        setSecurityQuestion("");
        setSecurity("");
        setOk(data.ok);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Something Wrong happened.. Please try again!!");
      // toast.error(err.response.data);
    }
  };
  return (
    <div className="container-fluid">
      <div className="col text-center">
        <div className="row bg-dark text-light py-3">
          <h1 style={{ color: "white" }}>Reset Password</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 offset-md-3">
          <ForgotPasswordForm
            changePassword={changePassword}
            email={email}
            setEmail={setEmail}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            newPasswordAgain={newPasswordAgain}
            setNewPasswordAgain={setNewPasswordAgain}
            securityQuestion={securityQuestion}
            setSecurityQuestion={setSecurityQuestion}
            security={security}
            setSecurity={setSecurity}
            loading={loading}
          />
        </div>

        <div className="row">
          <div className="col">
            <Modal
              title="Yay!! Password Changed.."
              visible={ok}
              closable={false}
              maskClosable={false}
              onCancel={() => {
                setOk(false);
              }}
              footer={null}
            >
              <p>Your password has been changed successfully!!</p>
              <Link href="/login">
                <a className="btn-primary btn-sm">Login</a>
              </Link>
            </Modal>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p className="text-center">
              <Link href="/forgot_security">
                <a>Forgot Security Answer</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default forgotPassword;
