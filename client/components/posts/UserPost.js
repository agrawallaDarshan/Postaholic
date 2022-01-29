import { Avatar, Dropdown, List } from "antd";
import moment from "moment";
import PostImage from "./PostImage";
import renderHTML from "react-render-html";
import { UserContext } from "../../context";
import { useContext } from "react";
import PostEditMenu from "../dropdowns/PostEditMenu";
import Link from "next/link";
import {
  HeartOutlined,
  HeartFilled,
  MenuOutlined,
  CommentOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const UserPost = ({
  posts,
  deletePost,
  deleting,
  handleLike,
  handleUnlike,
  handleComment,
}) => {
  const [state] = useContext(UserContext);
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
                <Avatar size={35} src={post.postedBy.image.url}></Avatar>
                <span className="m-2 p-1">
                  {post.postedBy.username
                    ? post.postedBy.username
                    : post.postedBy.name}
                </span>
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
                {state &&
                state.user &&
                post.likes &&
                post.likes.includes(state.user._id) ? (
                  <HeartFilled
                    className="text-danger h4 p-1"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleUnlike(post._id);
                    }}
                  ></HeartFilled>
                ) : (
                  <HeartOutlined
                    className="text-danger h4 p-1"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleLike(post._id);
                    }}
                  ></HeartOutlined>
                )}

                <span className="p-1">
                  {post.likes.length != 0
                    ? post.likes.length == 1
                      ? `${post.likes.length} like`
                      : `${post.likes.length} likes`
                    : ``}
                </span>
                <CommentOutlined
                  className="text-danger h4 p-1 mx-1"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleComment(post)}
                ></CommentOutlined>
                <span className="p-1">
                  <Link href={`/user/comments/${post._id}`}>
                    <a>
                      {post && post.comments && post.comments.length
                        ? post.comments == 1
                          ? "1 comment"
                          : `${post.comments.length} comments`
                        : ""}
                    </a>
                  </Link>
                </span>
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
            {post.comments && post.comments.length > 0 && (
              <div className="card-footer" style={{ backgroundColor: "white" }}>
                <List
                  itemLayout="horizontal"
                  dataSource={post.comments}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={item.postedBy.image && item.postedBy.image.url}
                          />
                        }
                        title={item.postedBy.username}
                        description={item.content}
                      />
                    </List.Item>
                  )}
                />
              </div>
            )}
          </div>
        ))}
    </>
  );
};

export default UserPost;
