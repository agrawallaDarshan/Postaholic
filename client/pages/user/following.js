import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/index";
import axios from "axios";
import { List, Avatar } from "antd";
import moment from "moment";
import { RollbackOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import Link from "next/link";

const Following = () => {
  const [people, setPeople] = useState([]);
  const [state, setState] = useContext(UserContext);

  useEffect(() => {
    if (state && state.jwtToken) {
      getFollowingUsers();
    }
  }, [state && state.jwtToken]);

  const getFollowingUsers = async () => {
    try {
      const { data } = await axios.get("/get-following");
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async (user) => {
    try {
      const { data } = await axios.put("/user-unfollow", { _id: user._id });
      console.log(data);
      //user-unfollow, update context, update localstorage
      let user_details = JSON.parse(localStorage.getItem("user_details"));
      user_details.user = data;
      localStorage.setItem("user_details", JSON.stringify(user_details));
      //Updating context state
      setState({ ...state, user: data });
      let followingPeople = people.filter((person) => {
        return person._id !== user._id;
      });
      toast.info(`You unfollowed ${user.username}`);
      setPeople(followingPeople);
    } catch (err) {
      toast.error("Something wrong happened..Please try again");
      console.log(err);
    }
  };
  
  return (
    <>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <List
            itemLayout="horizontal"
            dataSource={people}
            renderItem={(user) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={
                        user && user.image
                          ? user.image.url
                          : "https://joeschmoe.io/api/v1/random"
                      }
                    />
                  }
                  title={
                    <div className="d-flex justify-content-between">
                      {user.username ? user.username : user.name}
                      <span
                        className="text-primary follow"
                        onClick={() => {
                          handleUnfollow(user);
                        }}
                      >
                        unfollow
                      </span>
                    </div>
                  }
                  description={
                    user.about
                      ? user.about.length < 20
                        ? user.about
                        : user.about.substring(0, 20) + "......"
                      : "Joined " + moment(user.createdAt).fromNow()
                  }
                />
              </List.Item>
            )}
          />
          <div className="d-flex justify-content-center h4">
            <Link href="/user/dashboard">
              <a>
                <RollbackOutlined />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Following;
