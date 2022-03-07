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
  DeleteOutlined,
} from "@ant-design/icons";

const PostCard = ({
  post,
  deletePost,
  deleting,
  handleLike,
  handleUnlike,
  handleComment,
  commentNumbers = 10,
  removeComment,
  handleCommentLike,
  handleCommentUnlike,
  handleReply,
  replyNumbers = 12,
  removeReply,
  handleReplyLike,
  handleReplyUnlike,
}) => {
  const [state] = useContext(UserContext);
  const ColorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];
  const index = Math.floor(Math.random() * ColorList.length);
  return (
    <>
      {post && post.postedBy && (
        <div key={post._id} className="card mb-5" style={{
          "border" : "none"
        }}>
          <div className="card-header d-flex justify-content-between bg">
            {/* Image//Name//Moment */}
            <div>
              <Avatar
                size={35}
                src={
                  post && post.postedBy && post.postedBy.image
                    ? post.postedBy.image.url
                    : `https://joeschmoe.io/api/v1/random`
                }
              ></Avatar>
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
          <div className="card-body bg">
            {post.image && <PostImage url={post.image.url} />}
            {renderHTML(post.postContent)}
          </div>
          <div className="card-footer d-flex justify-content-between bg">
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
                <Link href={`/user/comment/${post._id}`}>
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
            <div
              className="card-footer bg"
              style={{
                maxHeight: "10rem",
                overflow: "scroll",
              }}
            >
              <List
                itemLayout="horizontal"
                dataSource={post.comments.slice(0, commentNumbers)}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={item.postedBy.image && item.postedBy.image.url}
                        />
                      }
                      title={
                        <div className="d-flex justify-content-between bg">
                          <span>{item.postedBy.username}</span>
                          {state &&
                            state.user &&
                            state.user._id === item.postedBy._id && (
                              <span>
                                <DeleteOutlined
                                  className="text-danger follow"
                                  style={{
                                    fontSize: "1rem",
                                  }}
                                  onClick={() => removeComment(post, item)}
                                />
                              </span>
                            )}
                        </div>
                      }
                      description={
                        <>
                          <div className="my-1 bg">{item.content}</div>
                          <div className="d-flex justify-content-between bg">
                            <div>
                              {state &&
                              state.user &&
                              item.likes &&
                              item.likes.includes(state.user._id) ? (
                                <HeartFilled
                                  className="text-danger"
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "1.25rem",
                                  }}
                                  onClick={() =>
                                    handleCommentUnlike(post, item)
                                  }
                                ></HeartFilled>
                              ) : (
                                <HeartOutlined
                                  className="text-danger"
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "1.25rem",
                                  }}
                                  onClick={() => handleCommentLike(post, item)}
                                ></HeartOutlined>
                              )}
                              <span className="mx-2 py-2 text-muted">
                                {item.likes.length > 0
                                  ? item.likes.length > 1
                                    ? `${item.likes.length} likes`
                                    : `1 like`
                                  : ""}
                              </span>

                              <span
                                className="text-muted follow mx-2"
                                onClick={() => handleReply(post, item)}
                              >
                                reply
                              </span>
                            </div>
                            <span>{moment(item.createdAt).fromNow()}</span>
                          </div>
                          {item.reply && item.reply.length > 0 && (
                            <div className="row bg">
                              <div className="col offset-sm-1">
                                <List
                                  itemLayout="horizontal"
                                  dataSource={item.reply.slice(0, replyNumbers)}
                                  renderItem={(subitem) => (
                                    <List.Item>
                                      <List.Item.Meta
                                        avatar={
                                          <Avatar
                                            src={
                                              subitem.postedBy.image &&
                                              subitem.postedBy.image.url
                                            }
                                          />
                                        }
                                        title={
                                          <div className="d-flex justify-content-between bg">
                                            <span>
                                              {subitem.postedBy.username}
                                            </span>
                                            {state &&
                                              state.user &&
                                              state.user._id ===
                                                subitem.postedBy._id && (
                                                <span>
                                                  <DeleteOutlined
                                                    className="text-danger follow"
                                                    style={{
                                                      fontSize: "1rem",
                                                    }}
                                                    onClick={() =>
                                                      removeReply(
                                                        post,
                                                        item,
                                                        subitem
                                                      )
                                                    }
                                                  />
                                                </span>
                                              )}
                                          </div>
                                        }
                                        description={
                                          <>
                                            <div className="my-1 bg">
                                              {subitem.content}
                                            </div>
                                            <div className="d-flex justify-content-between bg">
                                              <div>
                                                {state &&
                                                state.user &&
                                                subitem.likes &&
                                                subitem.likes.includes(
                                                  state.user._id
                                                ) ? (
                                                  <HeartFilled
                                                    className="text-danger"
                                                    style={{
                                                      cursor: "pointer",
                                                      fontSize: "1.25rem",
                                                    }}
                                                    onClick={() =>
                                                      handleReplyUnlike(
                                                        post,
                                                        item,
                                                        subitem
                                                      )
                                                    }
                                                  ></HeartFilled>
                                                ) : (
                                                  <HeartOutlined
                                                    className="text-danger"
                                                    style={{
                                                      cursor: "pointer",
                                                      fontSize: "1.25rem",
                                                    }}
                                                    onClick={() =>
                                                      handleReplyLike(
                                                        post,
                                                        item,
                                                        subitem
                                                      )
                                                    }
                                                  ></HeartOutlined>
                                                )}
                                                <span className="mx-2 py-2 text-muted">
                                                  {subitem.likes.length > 0
                                                    ? subitem.likes.length > 1
                                                      ? `${subitem.likes.length} likes`
                                                      : `1 like`
                                                    : ""}
                                                </span>

                                                <span
                                                  className="text-muted follow mx-2"
                                                  onClick={() =>
                                                    handleReply(post, item)
                                                  }
                                                >
                                                  reply
                                                </span>
                                              </div>
                                              <span>
                                                {moment(
                                                  subitem.createdAt
                                                ).fromNow()}
                                              </span>
                                            </div>
                                          </>
                                        }
                                      />
                                    </List.Item>
                                  )}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PostCard;
