//use npm run dev to deploy the code
//An HTTP request is made by a client, to a named host, which is located on a server.
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { useRouter } from "next/router";
import { UserContext } from "../context";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [security, setSecurity] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state] = useContext(UserContext);
  const router = useRouter();

  //image
  const [image, setImage] = useState({
    url: "https://joeschmoe.io/api/v1/random",
    public_id: "",
  });
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    // console.log(
    //   `name : ${name}\nemail : ${email}\npassword : ${password}\nsecurity : ${security}`
    // );
    //await operator is used to wait for a Promise.;
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/register`, {
        name,
        email,
        username,
        password,
        image,
        securityQuestion,
        security,
      });

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        setName("");
        setEmail("");
        setUsername("");
        setPassword("");
        setImage("");
        setSecurityQuestion("");
        setSecurity("");
        setOk(data.ok);
        setLoading(false);
      }
    } catch (err) {
      toast.error("Something Wrong happened.. Please try again!!");
      setLoading(false);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post("/upload-image", formData);
      setImage({
        url: data.url,
        public_id: data.public_id,
      });

      setUploading(false);
      if (data.message) {
        toast.success(data.message);
      } else {
        toast.error("Something wrong happened... please try again!!");
      }
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast.error("Something wrong happened");
    }
  };

  useEffect(() => {
    if (state && state.jwtToken) router.push("/user/dashboard");
  });

  return (
    <div className="container-fluid">
      <div
        className="row py-3"
        style={{
          backgroundColor: "#f0f0f2",
        }}
      >
        <div className="col text-center">
          <h1>Register</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 offset-md-3">
          <AuthForm
            handleSubmit={handleSubmit}
            handleImage={handleImage}
            image={image}
            uploading={uploading}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
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
              title="Congratulations!!"
              visible={ok}
              closable={false}
              maskClosable={false}
              onCancel={() => {
                setOk(false);
              }}
              footer={null}
            >
              <p>You have successfully registered.</p>
              <Link href="/login">
                <a className="btn-primary btn-sm">Login</a>
              </Link>
            </Modal>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p className="text-center">
              Already registered?&nbsp;
              <Link href="/login">
                <a>Login</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

// docker -> dockerhub -> ubuntu (container)
// DockerFile -> docker build -> GCP/AWS/Azure ( K8s) ->
