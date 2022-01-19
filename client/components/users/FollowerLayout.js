import { List, Avatar } from "antd";
import moment from "moment";

const FollowerLayout = ({ people, handleFollow }) => {
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
                {user.username ? user.username : user.name}
                <span className="text-primary follow" onClick={() => {
                  handleFollow(user)
                }}>Follow</span>
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
