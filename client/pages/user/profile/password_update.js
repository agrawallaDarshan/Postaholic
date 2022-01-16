import { useState } from "react";
import UpdatePassword from "../../../components/forms/UpdatePassword";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";

const passwordUpdate = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [security, setSecurity] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put("/user-password-update", {
        currentPassword,
        newPassword,
        securityQuestion,
        security,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setOk(true);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Something wrong happened.. Please try again");
      console.log(err);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row bg-dark text-light py-3">
        <div className="col text-center">
          <h1 style={{ color: "white" }}>Password Update</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 offset-md-3">
          <UpdatePassword
            handleSubmit={handleSubmit}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            securityQuestion={securityQuestion}
            setSecurityQuestion={setSecurityQuestion}
            security={security}
            setSecurity={setSecurity}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            loading={loading}
          />
        </div>

        <div className="row">
          <div className="col">
            <Modal
              title="Congratulations!!"
              visible={ok}
              closable={true}
              maskClosable={false}
              onCancel={() => {
                setOk(false);
              }}
              footer={null}
            >
              <p>Password updated successfully</p>
              <Link href="/user/dashboard">
                <a className="btn-primary btn-sm">dashboard</a>
              </Link>
            </Modal>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p className="text-center">
              <Link href="/user/profile/profile_update">
                <a>Profile Update</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default passwordUpdate;
