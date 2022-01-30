import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import PostCard from "../../../components/posts/PostCard";
import { RollbackOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const PostComments = () => {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const _id = router.query._id;

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
            <PostCard
              post={post}
              commentNumbers={100}
              removeComment={removeComment}
            />
          )}
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
