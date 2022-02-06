import { Avatar, List } from "antd";
import moment from "moment";
import PostImage from "./PostImage";
import renderHTML from "react-render-html";
import { UserContext } from "../../context";
import { useContext } from "react";
import { HeartOutlined, HeartFilled, CommentOutlined } from "@ant-design/icons";

const HomePagePost = ({ post, commentNumbers = 10, replyNumbers = 12 }) => {
  const [state] = useContext(UserContext);
  const ColorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];
  const index = Math.floor(Math.random() * ColorList.length);
  return (
    <>
      {post && post.postedBy && (
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
                <HeartFilled className="text-danger h4 p-1"></HeartFilled>
              ) : (
                <HeartOutlined className="text-danger h4 p-1"></HeartOutlined>
              )}

              <span className="p-1">
                {post.likes.length != 0
                  ? post.likes.length == 1
                    ? `${post.likes.length} like`
                    : `${post.likes.length} likes`
                  : ``}
              </span>
              <CommentOutlined className="text-danger h4 p-1 mx-1"></CommentOutlined>
              <span className="p-1">
                {post && post.comments && post.comments.length
                  ? post.comments == 1
                    ? "1 comment"
                    : `${post.comments.length} comments`
                  : ""}
              </span>
            </div>
          </div>
          {post.comments && post.comments.length > 0 && (
            <div
              className="card-footer"
              style={{
                backgroundColor: "white",
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
                        <div className="d-flex justify-content-between">
                          <span>{item.postedBy.username}</span>
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
                                    fontSize: "1.25rem",
                                  }}
                                ></HeartFilled>
                              ) : (
                                <HeartOutlined
                                  className="text-danger"
                                  style={{
                                    fontSize: "1.25rem",
                                  }}
                                ></HeartOutlined>
                              )}
                              <span className="mx-2 py-2 text-muted">
                                {item.likes.length > 0
                                  ? item.likes.length > 1
                                    ? `${item.likes.length} likes`
                                    : `1 like`
                                  : ""}
                              </span>

                              <span className="text-muted mx-2">reply</span>
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
                                                      fontSize: "1.25rem",
                                                    }}
                                                  ></HeartFilled>
                                                ) : (
                                                  <HeartOutlined
                                                    className="text-danger"
                                                    style={{
                                                      fontSize: "1.25rem",
                                                    }}
                                                  ></HeartOutlined>
                                                )}
                                                <span className="mx-2 py-2 text-muted">
                                                  {subitem.likes.length > 0
                                                    ? subitem.likes.length > 1
                                                      ? `${subitem.likes.length} likes`
                                                      : `1 like`
                                                    : ""}
                                                </span>

                                                <span className="text-muted mx-2">
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

export default HomePagePost;
