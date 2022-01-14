import { Menu } from "antd";
import { useRouter } from "next/router";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const menu = ({ post, deletePost }) => {
  const router = useRouter();

  return (
    <Menu>
      <Menu.Item icon={<EditOutlined />} key="editKey">
        <a
          onClick={() => {
            router.push(`/user/post/${post._id}`);
          }}
        >
          Edit
        </a>
      </Menu.Item>
      <Menu.Item
        icon={<DeleteOutlined className="text-danger" />}
        key="deleteKey"
      >
        <a
          onClick={() => {
            deletePost(post);
          }}
        >
          Delete
        </a>
      </Menu.Item>
    </Menu>
  );
};

export default menu;
