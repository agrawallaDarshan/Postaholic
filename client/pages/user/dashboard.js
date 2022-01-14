import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/index";
import UserValidation from "../../components/routes/userRoute";
import PostForm from "../../components/forms/PostForm";
import axios from "axios";
import { toast } from "react-toastify";
import { Drawer } from "antd";
import UserPost from "../../components/posts/UserPost";
import { PlusCircleFilled } from "@ant-design/icons";

const Home = () => {
  const [state] = useContext(UserContext);
  const [postContent, setPostContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [visible, setVisible] = useState(false);

  const onClose = () => {
    setVisible(false);
  };

  const showDrawer = () => {
    setVisible(true);
  };

  //useEffect(function, dependancies);
  useEffect(() => {
    if (state && state.jwtToken) {
      fetchUserPosts();
    }
  }, [state && state.jwtToken]);

  const fetchUserPosts = async () => {
    try {
      const { data } = await axios.get("/user-posts");
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const postSubmit = async (e) => {
    e.preventDefault();
    // console.log(postContent);
    try {
      const { data } = await axios.post("/create-post", {
        postContent,
        image,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        fetchUserPosts();
        toast.success(data.message);
      }
      setPostContent("");
      setImage("");
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

    setUploading(true);
    try {
      const { data } = await axios.post("/upload-image", formData);
      // console.log(data);
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

  const deletePost = async (post) => {
    try {
      const answer = window.confirm("Are you sure?");
      if (!answer) return;
      setDeleting(true);
      const { data } = await axios.delete(`/user-post-delete/${post._id}`);
      if (data.ok) {
        toast.success("Post deleted successfully");
      }
      setDeleting(false);
      fetchUserPosts();
    } catch (err) {
      setDeleting(false);
      console.log(err);
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
        <PlusCircleFilled
          onClick={showDrawer}
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            fontSize: "3rem",
            color: "#08c",
            // zindex: "1"
          }}
        />
        <div className="row p-3">
          <div className="col-md-8">
            <UserPost
              posts={posts}
              deletePost={deletePost}
              deleting={deleting}
            />
          </div>
          <div className="col-md-4">Slidebar</div>
        </div>
        <>
          <Drawer
            title="Drawer with extra actions"
            placement="top"
            onClose={onClose}
            visible={visible}
            // extra={
            //   <space>
            //     <button className="btn btn-primary btn-sm m-1" onClick={onClose}>
            //       Cancel
            //     </button>
            //     <button className="btn btn-primary btn-sm m-1" onClick={onClose}>
            //       OK
            //     </button>
            //   </space>
            // }
          >
            {/* Drawer's content */}
            <PostForm
              postContent={postContent}
              setPostContent={setPostContent}
              postSubmit={postSubmit}
              handleImage={handleImage}
              image={image}
              uploading={uploading}
            />
          </Drawer>
        </>
      </div>
    </UserValidation>
  );
};

export default Home;
