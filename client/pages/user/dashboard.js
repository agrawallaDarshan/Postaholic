import { useContext, useState } from "react";
import { UserContext } from "../../context/index";
import UserValidation from "../../components/routes/userRoute";
import PostForm from "../../components/forms/PostForm";
import axios from "axios";
import { toast } from "react-toastify";

const Home = () => {
  const [postContent, setPostContent] = useState("");

  const postSubmit = async (e) => {
    e.preventDefault();
    // console.log(postContent);
    try {
      const { data } = await axios.post("/create-post", {
        postContent,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
      }
      setPostContent("");
    } catch (err) {
      // console.log("err => ", err);
      toast.error("Something wrong happened.. Please try again");
    }
  };

  const handleImage = async (e) => {
    // console.log(e.target.files[0]);
    //FormData -> FormData interface provides a way to easily construct a key/value pair, representing different form fields(image, pdf, docx) and their corresponding values.
    //We store the input file data in the form of formdata which can be easily send to the backend/server
    const file = e.target.files[0];
    let formData = new FormData();
    //FormData constructor is available in the browser side
    //use formData.append(key, value) to store file
    formData.append("image", file);

    try {
      const { data } = await axios.post("/upload-image", formData);
      console.log(data);
    } catch (err) {
      toast.error("Something wrong happened");
    }
  };

  return (
    <UserValidation>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <h1 className="display-1 text-center">Dashboard Page</h1>
          </div>
        </div>
        <div className="row p-3">
          <div className="col-md-8">
            <PostForm
              postContent={postContent}
              setPostContent={setPostContent}
              postSubmit={postSubmit}
              handleImage={handleImage}
            />
          </div>
          <div className="col-md-4">Slidebar</div>
        </div>
      </div>
    </UserValidation>
  );
};

export default Home;
