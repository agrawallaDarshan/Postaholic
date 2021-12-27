import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";

const forgotSecurity = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [security, setSecurity] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [buttonText, setButtonText] = useState("Send Verification Code");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const changePassword = async (e) => {
    e.preventDefault();
    if (buttonText === "Send Verification Code") {
      setLoading(true);
      try {
        const { data } = await axios.post("/send-email", {
          email,
        });

        if (data.error) {
          setLoading(false);
          toast.error(data.error);
        } else {
          setLoading(false);
          toast.success("Email send successfully");
          setButtonText("Submit");
        }
      } catch (err) {
        setLoading(false);
        toast.error("Something Wrong happened.. Please try again!!");
      }
    } else {
      try {
        setLoading(true);
        const { data } = await axios.post("/verify-code", {
          email,
          newPassword,
          newPasswordAgain,
          securityQuestion,
          security,
          verificationCode,
        });

        if (data.error) {
          setLoading(false);
          setVerificationCode("");
          toast.error(data.error);
        } else {
          setLoading(false);
          setEmail("");
          setNewPassword("");
          setNewPasswordAgain("");
          setSecurityQuestion("");
          setSecurity("");
          setVerificationCode("");
          setOk(data.ok);
        }
      } catch (err) {
        setLoading(false);
        toast.error(err.response.data);
      }
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
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            buttonText={buttonText}
            loading={false}
            page="forgot_security"
          />
        </div>

        <div className="row">
          <div className="col">
            <p className="text-center">
              <Link href="/login">
                <a>Back to login</a>
              </Link>
            </p>
          </div>
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
      </div>
    </div>
  );
};

export default forgotSecurity;
