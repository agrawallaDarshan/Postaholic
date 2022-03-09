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

  //image
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (state && state.user) {
      setImage(state.user.image);
      setName(state.user.name);
      setEmail(state.user.email);
      setUsername(state.user.username);
      setAbout(state.user.about);
    }
  }, [state && state.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put("/user-profile-update", {
        name,
        username,
        image,
        about,
      });

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        //updating localstorage
        let user_details = JSON.parse(localStorage.getItem("user_details"));
        user_details.user = data.updatedUser;
        localStorage.setItem("user_details", JSON.stringify(user_details));
        //updating usercontext
        setState({ ...state, user: data.updatedUser });

        setLoading(false);
        setOk(true);
      }
    } catch (err) {
      toast.error("Oops! something wrong happened");
      setLoading(false);
      console.log(err);
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
      setUploading(false);
      toast.error("Something wrong happened");
    }
  };

  return (
    <div className="container-fluid">
      <div
        className="row py-3"
        style={{
          backgroundColor: "#f0f0f2",
        }}
      >
        <div
          className="col text-center"
          style={{
            backgroundColor: "505050",
            color: "white",
          }}
        >
          <h1>Profile Update</h1>
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
