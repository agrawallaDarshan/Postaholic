import { useRouter } from "next/router";
import UserValidation from "../../../components/routes/userRoute";
import axios from "axios";
import { useEffect, useState } from "react";
import EditPostForm from "../../../components/posts/EditPostForm";
import { toast } from "react-toastify";

const userPostEdit = () => {
  const [postContent, setPostContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [post, setPost] = useState({});
  const router = useRouter();
  const _id = router.query._id;

  useEffect(() => {
    if (_id) {
      fetchUserPosts();
    }
  }, [_id]);

  const fetchUserPosts = async () => {
    try {
      const { data } = await axios(`/user-post-edit/${_id}`);
      setPostContent(data.post.postContent);
      setImage(data.post.image);
      setPost(data.post);
    } catch (err) {
      console.log(err);
    }
  };

  const postSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/user-post-update/${_id}`, {
        postContent,
        image,
      });

      if (data.error) {
        toast.error("Post updation failed");
      } else {
        toast.success("Post updated successfully");
      }

      router.push("/user/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  const handleImage = async (e) => {
    // e.preventDefault();
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const { data } = await axios.post("/upload-image", formData);
      setImage({
        url: data.url,
        public_id: data.public_id,
      });

      setUploading(false);

      if (data.message) {
        toast.success(data.message);
      } else {
        toast.error("Something wrong happened... please try again!!");
      }
    } catch (err) {
      setUploading(false);
      toast.error("Something wrong happened");
    }
  };

  const deleteImage = async (image) => {
    try {
      const answer = window.confirm("Are you sure?");
      if(!answer) return
      const { data } = await axios.delete(`/delete-image/${image.public_id}`);
      if (data.ok) {
        toast.success("Image deleted successfully");
      }
      setImage({});
    } catch (err) {
      setImage({});
      toast.error("Something wrong happened");
      console.log(err);
    }
  };

  return (
    <UserValidation>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <h1 className="display-1 text-center">Dashboard Page</h1>
          </div>
        </div>

        <div className="row p-3">
          <div className="col-md-8 offset-md-2">
            <EditPostForm
              postContent={postContent}
              setPostContent={setPostContent}
              postSubmit={postSubmit}
              image={image}
              handleImage={handleImage}
              post={post}
              uploading={uploading}
              deleteImage={deleteImage}
            />
          </div>
        </div>
      </div>
    </UserValidation>
  );
};

export default userPostEdit;
