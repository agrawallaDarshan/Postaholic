import { Avatar } from "antd";
import moment from "moment";
import PostImage from "./PostImage";
import renderHTML from "react-render-html";
import { HeartOutlined, HeartFilled, CommentOutlined } from "@ant-design/icons";

const UserPost = ({ posts }) => {
  const ColorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];
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
                    backgroundColor: `${
                      ColorList[Math.floor(Math.random() * ColorList.length)]
                    }`,
                  }}
                >
                  {post.postedBy.name[0]}
                </Avatar>
                <span className="m-2 p-1">{post.postedBy.name}</span>
              </div>
              <div className="m-1">{moment(post.createdAt).fromNow()}</div>
            </div>
            <div className="card-body">
              {post.image && <PostImage url={post.image.url} />}
              {renderHTML(post.postContent)}
            </div>
            <div className="card-footer d-flex">
              <HeartOutlined className="text-danger h5 p-1"></HeartOutlined>
              <div
                className="text-center p-1"
                style={{
                  marginRight: "1rem",
                }}
              >
                3 likes
              </div>
              <CommentOutlined className="text-danger h5 p-1"></CommentOutlined>
              <div
                className="text-center p-1"
              >
                4 comments
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default UserPost;
