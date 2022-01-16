import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../../../components/forms/AuthForm";
import { UserContext } from "../../../context/index";

const profileUpdate = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(UserContext);

  useEffect(() => {
    if (state && state.user) {
      setName(state.user.name);
      setEmail(state.user.email);
      setUsername(state.user.username);
      setAbout(state.user.about);
    }
  }, [state && state.user]);

  const handleSubmit = async (e) => {
    // console.log(
    //   `name : ${name}\nemail : ${email}\npassword : ${password}\nsecurity : ${security}`
    // );
    //await operator is used to wait for a Promise.;
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put("/user-profile-update", {
        name,
        username,
        about,
      });

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        //updating localstorage
        let user_details = JSON.parse(localStorage.getItem("user_details"));
        user_details.user = data;
        localStorage.setItem("user_details", JSON.stringify(user_details));
        //updating usercontext
        setState({ ...state, user: data });

        setLoading(false);
        setOk(true);
      }
    } catch (err) {
      toast.error("Oops! something wrong happened");
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row bg-dark text-light py-3">
        <div className="col text-center">
          <h1 style={{ color: "white" }}>Profile Update</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 offset-md-3">
          <AuthForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            email={email}
            username={username}
            setUsername={setUsername}
            about={about}
            setAbout={setAbout}
            isUpdatePage={true}
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
              <p>Profile updated successfully.</p>
              <Link href="/user/dashboard">
                <a className="btn-primary btn-sm">Dashboard</a>
              </Link>
            </Modal>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p className="text-center">
              <Link href="/user/profile/password_update">
                <a>Update Password</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default profileUpdate;

// docker -> dockerhub -> ubuntu (container)
// DockerFile -> docker build -> GCP/AWS/Azure ( K8s) ->