import { Avatar, Dropdown } from "antd";
import moment from "moment";
import PostImage from "./PostImage";
import renderHTML from "react-render-html";
import { UserContext } from "../../context";
import { useContext } from "react";
import { useRouter } from "next/router";
import PostEditMenu from "../dropdowns/PostEditMenu";
import {
  HeartOutlined,
  HeartFilled,
  MenuOutlined,
  CommentOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const UserPost = ({ posts, deletePost, deleting }) => {
  const [state] = useContext(UserContext);
  const router = useRouter();

  const ColorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];
  const index = Math.floor(Math.random() * ColorList.length);
  return (
    <>
      {posts &&
        posts.map((post) => (
          <div key={post._id} className="card mb-5">
            <div className="card-header d-flex justify-content-between">
              {/* Image//Name//Moment */}
              <div>
                <Avatar
                  size={35}
                  style={{
                    backgroundColor: `${ColorList[index]}`,
                  }}
                >
                  {post.postedBy.name[0]}
                </Avatar>
                <span className="m-2 p-1">{post.postedBy.name}</span>
              </div>
              <div className="m-1">
                {post.isEdited
                  ? "Updated " + moment(post.updatedAt).fromNow()
                  : moment(post.createdAt).fromNow()}
              </div>
            </div>
            <div className="card-body">
              {post.image && <PostImage url={post.image.url} />}
              {renderHTML(post.postContent)}
            </div>
            <div className="card-footer d-flex justify-content-between">
              <div>
                <HeartOutlined
                  className="text-danger h4 p-1"
                  style={{ cursor: "pointer" }}
                ></HeartOutlined>
                <span className="p-1">3 likes</span>
                <CommentOutlined
                  className="text-danger h4 p-1 mx-1"
                  style={{ cursor: "pointer" }}
                ></CommentOutlined>
                <span className="p-1">4 comments</span>
              </div>

              {state && state.user && state.user._id === post.postedBy._id && (
                <Dropdown
                  className="p-1"
                  overlay={<PostEditMenu post={post} deletePost={deletePost} />}
                  trigger={["click"]}
                >
                  <a
                    className="ant-dropdown-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    {!deleting ? <MenuOutlined /> : <LoadingOutlined />}
                  </a>
                </Dropdown>
              )}
            </div>
          </div>
        ))}
    </>
  );
};

export default UserPost;
