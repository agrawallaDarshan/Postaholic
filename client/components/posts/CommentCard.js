import { useContext } from "react";
import { UserContext } from "../../context";
import { Avatar, Dropdown, List } from "antd";
import moment from "moment";
import {
  DeleteOutlined,
  HeartFilled,
  HeartOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import renderHTML from "react-render-html";
const CommentCard = ({
  post,
  handleComment,
  commentNumbers = 50,
  removeComment,
  handleReply,
  replyNumbers = 10,
  removeReply,
  handleReplyLike,
  handleReplyUnlike,
  handleCommentLike,
  handleCommentUnlike,
}) => {
  const [state] = useContext(UserContext);
  return (
    <>
      {post && (
        <div className="card mb-5">
          <div className="card-header">
            <Avatar
              src={
                post.postedBy && post.postedBy.image && post.postedBy.image.url
              }
              size={50}
              className="m-1"
            />
            <div>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                {post.postedBy.username}
              </span>
              <span>{renderHTML(post.postContent)}</span>
            </div>
          </div>
          <div className="card-body d-flex justify-content-between">
            <div>
              <CommentOutlined
                className="text-danger h4 p-1 mx-1"
                style={{ cursor: "pointer" }}
                onClick={() => handleComment(post)}
              ></CommentOutlined>
              <span className="p-1">
                {post && post.comments && post.comments.length
                  ? post.comments == 1
                    ? "1 comment"
                    : `${post.comments.length} comments`
                  : ""}
              </span>
            </div>
            <div>{moment(post.createdAt).fromNow()}</div>
          </div>
          {post.comments && post.comments.length > 0 && (
            <div
              className="card-footer"
              style={{
                backgroundColor: "white",
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
                        <div className="d-flex justify-content-between">
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
                          <div className="my-1">{item.content}</div>
                          <div className="d-flex justify-content-between">
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
                            <div className="row">
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
                                          <div className="d-flex justify-content-between">
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
                                            <div className="my-1">
                                              {subitem.content}
                                            </div>
                                            <div className="d-flex justify-content-between">
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

export default CommentCard;
