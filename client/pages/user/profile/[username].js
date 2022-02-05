import axios from "axios";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../context";
import { Card } from "antd";
import Link from "next/link";
import { toast } from "react-toastify";
import { RollbackOutlined } from "@ant-design/icons";

const UserProfile = () => {
  const [state, setState] = useContext(UserContext);
  const [user, setUser] = useState({});
  console.log(state);

  const router = useRouter();
  const username = router.query.username;

  useEffect(() => {
    if (username) {
      fetchUserDetails();
    }
  }, [username]);

  const fetchUserDetails = async () => {
    try {
      const { data } = await axios.get(`/get-user/${username}`);
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollow = async () => {
    try {
      const { data } = await axios.put("/user-follow", {
        _id: user._id,
      });
      console.log(data);
      //update the localstorage
      let user_details = JSON.parse(localStorage.getItem("user_details"));
      user_details.user = data;
      localStorage.setItem("user_details", JSON.stringify(user_details));
      //Update the context
      setState({ ...state, user: data });
      //filtering the followed user in the client side
      toast.info(`You started following ${username}`);
      console.log(state);
      fetchUserDetails();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async () => {
    try {
      const { data } = await axios.put("/user-unfollow", { _id: user._id });
      console.log(data);
      //user-unfollow, update context, update localstorage
      let user_details = JSON.parse(localStorage.getItem("user_details"));
      user_details.user = data;
      localStorage.setItem("user_details", JSON.stringify(user_details));
      //Updating context state
      setState({ ...state, user: data });
      toast.error(`You unfollowed ${username}`);
      console.log(state);
      fetchUserDetails();
    } catch (err) {
      toast.error("Something wrong happened..Please try again");
      console.log(err);
    }
  };

  return (
    <>
      <div className="container-fluid row">
        <div className="offset-md-3 col-md-6">
          {/* <pre>{JSON.stringify(user, null, 6)}</pre> */}
          <Card
            hoverable
            size="5rem"
            cover={
              <img
                alt={user && user.name}
                src={user && user.image && user.image.url}
                style={{
                  width: "15rem",
                }}
              />
            }
          >
            <Card.Meta
              style={{
                fontSize: "1rem",
              }}
              title={user && user.username}
              description={user && user.about}
            />
            <div
              className="d-flex justify-content-between mt-1"
              style={{
                fontSize: "1.25rem",
              }}
            >
              <span>{user.followers && user.followers.length} Followers</span>
              <span>{user.following && user.following.length} Following</span>
            </div>

            <div className="row mt-2">
              <div className="col">
                {user.followers && user.followers.includes(state.user._id) ? (
                  <button
                    className="btn btn-outline-danger col-12"
                    onClick={handleUnfollow}
                  >
                    unfollow
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-primary col-12"
                    onClick={handleFollow}
                  >
                    follow
                  </button>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="d-flex justify-content-center h4 mt-4">
          <Link href="/user/dashboard">
            <a>
              <RollbackOutlined />
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
