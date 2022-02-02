import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { RollbackOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import CommentCard from "../../../components/posts/CommentCard";
import CommentForm from "../../../components/forms/CommentForm";
import { Modal } from "antd";
import ReplyForm from "../../../components/forms/ReplyForm";

const PostComments = () => {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const _id = router.query._id;

  //comments
  const [comment, setComment] = useState("");
  const [currentPost, setCurrentPost] = useState({});
  const [commentVisible, setCommentVisible] = useState(false);
  const [currentComment, setCurrentComment] = useState({});
  const [reply, setReply] = useState("");
  const [replyVisible, setReplyVisible] = useState(false);

  useEffect(() => {
    if (_id) getUserPost();
  }, [_id]);

  const getUserPost = async () => {
    try {
      const { data } = await axios.get(`/get-user-post/${_id}`);
      setPost(data);
      setLoading(false);
    } catch (err) {
      toast.error("Cannot able to fetch post");
      console.log(err);
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
      getUserPost();
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

      getUserPost();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentLike = async (post, comment) => {
    console.log(post._id, comment._id);
    try {
      const { data } = await axios.put("/like-comment", {
        postId: post._id,
        commentId: comment._id,
      });

      getUserPost();
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

      getUserPost();
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

      getUserPost();
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

      getUserPost();
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
      getUserPost();
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

      getUserPost();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <h1 className="display-1 text-center">Post comments</h1>
          </div>
        </div>
        <div className="col-md-8 offset-md-2">
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spin tip="Loading..." className="display-1" />
            </div>
          ) : (
            <CommentCard
              post={post}
              commentNumbers={100}
              handleComment={handleComment}
              removeComment={removeComment}
              handleReply={handleReply}
              replyNumbers={10}
              removeReply={removeReply}
              handleReplyLike={handleReplyLike}
              handleReplyUnlike={handleReplyUnlike}
              handleCommentLike={handleCommentLike}
              handleCommentUnlike={handleCommentUnlike}
            />
          )}
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
        <div className="d-flex justify-content-center h3 p-5">
          <Link href="/user/dashboard">
            <a>{loading ? "" : <RollbackOutlined />}</a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PostComments;
