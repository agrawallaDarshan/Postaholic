import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/index";
import UserValidation from "../../components/routes/userRoute";
import PostForm from "../../components/forms/PostForm";
import axios from "axios";
import { toast } from "react-toastify";
import { Drawer } from "antd";
import UserPost from "../../components/posts/UserPost";
import { PlusCircleFilled } from "@ant-design/icons";
import FollowerLayout from "../../components/users/FollowerLayout";
import CommentForm from "../../components/forms/CommentForm";
import Link from "next/link";
import { Modal } from "antd";

const Home = () => {
  const [state, setState] = useContext(UserContext);
  const [postContent, setPostContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [visible, setVisible] = useState(false);

  //people
  const [people, setPeople] = useState([]);

  //comments
  const [comment, setComment] = useState("");
  const [currentPost, setCurrentPost] = useState({});
  const [commentVisible, setCommentVisible] = useState(false);

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
      findPeopleToFollow();
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

  const findPeopleToFollow = async () => {
    try {
      const { data } = await axios.get("/find-people");
      setPeople(data);
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

    try {
      setUploading(true);
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

  const handleFollow = async (user) => {
    try {
      const { data } = await axios.put("/user-follow", {
        _id: user._id,
      });
      //update the localstorage
      let user_details = JSON.parse(localStorage.getItem("user_details"));
      user_details.user = data;
      localStorage.setItem("user_details", JSON.stringify(user_details));
      //Update the context
      setState({ ...state, user: data });
      //filtering the followed user in the client side
      let unfollowedPeople = people.filter((person) => {
        return person._id !== user._id;
      });
      toast.info(`You started following ${user.username}`);
      fetchUserPosts();
      setPeople(unfollowedPeople);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const { data } = await axios.put("/like-post", {
        _id: postId,
      });

      fetchUserPosts();
    } catch (err) {
      console.log(err);
      toast.error("Something wrong happened... please try again!!");
    }
  };

  const handleUnlike = async (postId) => {
    try {
      const { data } = await axios.put("/unlike-post", {
        _id: postId,
      });

      fetchUserPosts();
    } catch (err) {
      console.log(err);
      toast.error("Something wrong happened... please try again!!");
    }
  };

  const handleComment = async (post) => {
    setCurrentPost(post);
    setCommentVisible(true);
  };

  const addComment = async (e) => {
    e.preventDefault();
    // console.log(currentPost);
    // console.log(
    //   `Post ${comment} comment on ${currentPost.postedBy.username}'s post by ${state.user.username}`
    // );

    try {
      const { data } = await axios.put("/add-post-comment", {
        _id: currentPost._id,
        comment: comment,
      });

      console.log(data);
      setCommentVisible(false);
      setComment("");
      fetchUserPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const removeComment = async (post, comment) => {
    let answer = window.confirm("Do you really wanna delete it.");
    if (!answer) return;
    try {
      const { data } = await axios.put("/remove-user-comment", {
        _id: post._id,
        comment: comment,
      });

      fetchUserPosts();
    } catch (err) {
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
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              handleComment={handleComment}
              removeComment={removeComment}
            />
          </div>
          <div className="col-md-4">
            {/* <pre>{JSON.stringify(people, null, 4)}</pre> */}
            <div className="d-flex justify-content-between">
              {state && state.user && state.user.following && (
                <Link href="/user/following">
                  <a className="h5">{state.user.following.length} Following</a>
                </Link>
              )}
              {state && state.user && state.user.following && (
                <Link href="/user/followers">
                  <a className="h5">{state.user.followers.length} Followers</a>
                </Link>
              )}
            </div>
            <FollowerLayout people={people} handleFollow={handleFollow} />
          </div>
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
      <div>
        <Modal
          visible={commentVisible}
          onCancel={() => setCommentVisible(false)}
          footer={null}
          title="Comment Box"
        >
          <CommentForm
            comment={comment}
            setComment={setComment}
            addComment={addComment}
          />
        </Modal>
      </div>
    </UserValidation>
  );
};

export default Home;
