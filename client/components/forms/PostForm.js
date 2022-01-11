// import ReactQuill from "react-quill"; // ES6 -> This kind of import will not work in next js however it will work in react js. Because next js is both client and server side rendering and reactquill only works on client side only.
//To make it work we have to use ssr(Server Side Rendering) : false
// import "react-quill/dist/quill.snow.css";
//We have to use dynamic import to make react-quill work
import dynamic from "next/dynamic";
const ReactQuill = dynamic(
  //first Argument -> A import function
  () => import("react-quill"),

  //Second Argument -> ssr : false
  { ssr: false }
);
import "react-quill/dist/quill.snow.css";
import { CameraFilled } from "@ant-design/icons";
import { Avatar } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Modal } from "antd";
import { useState } from "react";

const PostForm = ({
  postContent,
  setPostContent,
  postSubmit,
  handleImage,
  image,
  uploading,
}) => {
  const [ok, setOk] = useState(false);
  return (
    <div className="card">
      <div className="card-body">
        <form className="form-group">
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
        <div>
          <button
            className="btn btn-primary btn-sm my-1 mx-2"
            onClick={() => {
              console.log("Hello");
            }}
            hidden={image && image.url === undefined}
          >
            Edit
          </button>
          <label className="my-1 mx-2">
            {image && image.url ? (
              <Avatar size={35} src={image.url} shape="square" />
            ) : uploading ? (
              <LoadingOutlined />
            ) : (
              <CameraFilled />
            )}
            <input
              //Used the accept tag to specify the content of file which this input field will accept
              onChange={handleImage}
              type="file"
              accept="image/*"
              hidden
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
