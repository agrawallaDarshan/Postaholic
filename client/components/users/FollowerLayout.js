import { List, Avatar } from "antd";
import { useContext } from "react";
import moment from "moment";
import { UserContext } from "../../context";
import Link from "next/link";

const FollowerLayout = ({ people, handleFollow, searchUsers = true }) => {
  const [state] = useContext(UserContext);
  return (
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
                <Link href={`/user/profile/${user.username}`}>
                  <a>{user.username ? user.username : user.name}</a>
                </Link>
                {user.followers.includes(
                  state && state.user && state.user._id
                ) ? (
                  <span>Following</span>
                ) : (
                  !searchUsers && (
                    <span
                      className="text-primary follow"
                      onClick={() => {
                        handleFollow(user);
                      }}
                    >
                      Follow
                    </span>
                  )
                )}
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
  );
};

export default FollowerLayout;
