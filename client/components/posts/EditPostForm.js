import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { Avatar, Menu } from "antd";
import { toast } from "react-toastify";
import moment from "moment";
import PostImage from "./PostImage";
import {
  CameraFilled,
  LoadingOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

const EditPostForm = ({
  postContent,
  setPostContent,
  postSubmit,
  image,
  handleImage,
  post,
  uploading,
  deleteImage,
}) => {
  const ColorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];
  const index = 0;
  return (
    <>
      <div className="card mb-5">
        <div className="card-header d-flex justify-content-between">
          {/* Image//Name//Moment */}
          <div>
            <Avatar
              size={35}
              style={{
                backgroundColor: `${ColorList[index]}`,
              }}
            >
              {post && post.postedBy ? post.postedBy.name[0] : "User"}
            </Avatar>
            <span className="m-2 p-1">
              {post && post.postedBy
                ? post.postedBy.username
                  ? post.postedBy.username
                  : post.postedBy.name
                : "U"}
            </span>
          </div>
          <div className="m-1">
            {post
              ? post.isEdited
                ? post.updatedAt &&
                  "Updated " + moment(post.updatedAt).fromNow()
                : post.createdAt && moment(post.createdAt).fromNow()
              : ""}
          </div>
        </div>
        <div className="card-body">
          {image && image.url && <PostImage url={image.url} />}
          <form className="form-group my-3">
            <ReactQuill
              theme="snow"
              value={postContent}
              onChange={(e) => {
                setPostContent(e);
              }}
              className="form-control"
              placeholder="write something..."
            />
          </form>
        </div>
        <div className="card-footer d-flex justify-content-between">
          <button
            disabled={!postContent}
            onClick={postSubmit}
            className="btn btn-primary btn-sm my-1 mx-1"
          >
            Post
          </button>
          {image && image.url && (
            <button
              className="btn btn-primary btn-sm my-1 mx-1"
              onClick={() => {
                deleteImage(image);
              }}
            >
              <DeleteOutlined />
            </button>
          )}
          <label className="my-1 mx-2">
            {image && image.url ? (
              <Avatar
                size={35}
                src={image.url}
                shape="square"
                onClick={() => {
                  image &&
                    image.url &&
                    toast.error("Delete current image to Upload new");
                }}
              />
            ) : uploading ? (
              <LoadingOutlined />
            ) : (
              <CameraFilled />
            )}
            <input
              onChange={handleImage}
              type="file"
              accept="image/*"
              hidden
              disabled={image && image.url}
            />
          </label>
        </div>
      </div>
    </>
  );
};

export default EditPostForm;
