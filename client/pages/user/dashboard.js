import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/index";
import UserValidation from "../../components/routes/userRoute";
import PostForm from "../../components/forms/PostForm";
import axios from "axios";
import { toast } from "react-toastify";
import { Drawer } from "antd";
import UserPost from "../../components/posts/UserPost";
import FollowerLayout from "../../components/users/FollowerLayout";
import CommentForm from "../../components/forms/CommentForm";
import Link from "next/link";
import { Modal, Pagination } from "antd";
import ReplyForm from "../../components/forms/ReplyForm";
import SearchUser from "../../components/SearchUser";
import Footer from "../../components/footer/Footer";
import io from "socket.io-client";

//socket.io
const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_IO_URL,
  { path: "/socket.io" },
  {
    reconnection: true,
  }
);

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
  const [currentComment, setCurrentComment] = useState({});
  const [reply, setReply] = useState("");
  const [replyVisible, setReplyVisible] = useState(false);

  //pagination
  const perPageItems = 5;
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  //UserSearch
  const [search, setSearch] = useState("");
  const [searchedData, setSearchData] = useState([]);

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
      const color = window.localStorage.getItem("background_color")
        ? window.localStorage.getItem("background_color")
        : "white";
      if (color === "white") {
        window &&
          window.document.documentElement.style.setProperty(
            "--dark-background-color",
            color
          );
        window &&
          window.document.documentElement.style.setProperty(
            "--light-text-color",
            "black"
          );
      } else {
        window &&
          window.document.documentElement.style.setProperty(
            "--dark-background-color",
            color
          );
        window &&
          window.document.documentElement.style.setProperty(
            "--light-text-color",
            "white"
          );
      }
    }
  }, [state && state.jwtToken, currentPage]);

  useEffect(() => {
    if (state && state.jwtToken) getTotalPosts();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search]);

  const fetchUserPosts = async () => {
    try {
      const { data } = await axios.get(`/user-posts/${currentPage}`);
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
        setCurrentPage(1);
        fetchUserPosts();
        toast.success("Post shared successfully");
        socket.emit("send-user-post", data);
      }

      getTotalPosts();
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
      getTotalPosts();
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
      getTotalPosts();
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
    //console.log(currentPost);
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

  const handleCommentLike = async (post, comment) => {
    try {
      const { data } = await axios.put("/like-comment", {
        postId: post._id,
        commentId: comment._id,
      });

      fetchUserPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentUnlike = async (post, comment) => {
    try {
      const { data } = await axios.put("/unlike-comment", {
        postId: post._id,
        commentId: comment._id,
      });

      fetchUserPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const handleReply = async (post, comment) => {
    setCurrentPost(post);
    setCurrentComment(comment);
    setReplyVisible(true);
  };

  const handleReplyLike = async (post, comment, reply) => {
    try {
      const { data } = await axios.put("/like-reply", {
        postId: post._id,
        commentId: comment._id,
        replyId: reply._id,
      });

      fetchUserPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const handleReplyUnlike = async (post, comment, reply) => {
    try {
      const { data } = await axios.put("/unlike-reply", {
        postId: post._id,
        commentId: comment._id,
        replyId: reply._id,
      });

      fetchUserPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const addReply = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/add-user-reply", {
        postId: currentPost._id,
        commentId: currentComment._id,
        content: reply,
      });

      setReplyVisible(false);
      setReply("");
      fetchUserPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const removeReply = async (post, comment, reply) => {
    // console.log(post.postContent, comment.content, reply.content);
    let answer = window.confirm("Do you really wanna delete it.");
    if (!answer) return;
    try {
      const { data } = await axios.put("/remove-user-reply", {
        postId: post._id,
        commentId: comment._id,
        replyId: reply._id,
      });

      fetchUserPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalPosts = async () => {
    try {
      const { data } = await axios.get("/total-posts");
      setTotalPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async () => {
    // console.log("Search for ", search);
    try {
      if (search.length == 0) {
        setSearchData([]);
        return;
      }
      const { data } = await axios.get(`/search-user/${search}`);
      console.log(data);
      setSearchData(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserValidation>
      <div className="container-fluid bg">
        {/* <div className="row">
          <div className="col">
            <h1 className="display-1 text-center">Dashboard Page</h1>
          </div>
        </div> */}
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
              handleCommentLike={handleCommentLike}
              handleCommentUnlike={handleCommentUnlike}
              handleReply={handleReply}
              removeReply={removeReply}
              handleReplyLike={handleReplyLike}
              handleReplyUnlike={handleReplyUnlike}
            />
          </div>
          <div className="col-md-4 bg">
            {/* <pre>{JSON.stringify(people, null, 4)}</pre> */}
            <SearchUser
              search={search}
              setSearch={setSearch}
              handleSearch={handleSearch}
            />
            {search.length > 0 && searchedData.length > 0 && (
              <FollowerLayout people={searchedData} />
            )}
            <div className="d-flex justify-content-between bg">
              {state && state.user && state.user.following && (
                <Link href="/user/following">
                  <a
                    className="h5"
                    style={{
                      color: "white",
                    }}
                  >
                    {state.user.following.length} Following
                  </a>
                </Link>
              )}
              {state && state.user && state.user.following && (
                <Link href="/user/followers">
                  <a
                    className="h5"
                    style={{
                      color: "white",
                    }}
                  >
                    {state.user.followers.length} Followers
                  </a>
                </Link>
              )}
            </div>
            <FollowerLayout
              people={people}
              handleFollow={handleFollow}
              SearchUser={false}
            />
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
      <div className="d-flex justify-content-center bg">
        <Pagination
          current={currentPage}
          total={totalPosts}
          pageSize={perPageItems}
          onChange={(value) => setCurrentPage(value)}
          className="m-1 p-1 mb-5"
        />
      </div>
      <Footer showDrawer={showDrawer} />
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
      <div>
        <Modal
          visible={replyVisible}
          onCancel={() => setReplyVisible(false)}
          footer={null}
          title="Reply Box"
        >
          <ReplyForm reply={reply} setReply={setReply} addReply={addReply} />
        </Modal>
      </div>
    </UserValidation>
  );
};

export default Home;
