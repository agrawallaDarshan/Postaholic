import { useContext, useEffect, useState } from "react";
import axios from "axios";
import HomePagePost from "../components/posts/HomePagePost";
import Head from "next/head";
import Link from "next/link";
import { LoadingOutlined } from "@ant-design/icons";
import io from "socket.io-client";
import { UserContext } from "../context";

const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_IO_URL,
  { path: "/socket.io" },
  {
    reconnection: true,
  }
);

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [bgColor, setBgColor] = useState();

  useEffect(() => {
    socket.on("new-user-post", (post) => {
      setUserPosts([post, ...posts]);
    });
  });

  useEffect(() => {
    getDisplayPosts();
    const color = window.localStorage.getItem("background_color")
      ? window.localStorage.getItem("background_color")
      : "white";
    if (color === "white") {
      setBgColor("white");
      window &&
        window.document.documentElement.style.setProperty(
          "--dark-background-color",
          color
        );
      window &&
        window.document.documentElement.style.setProperty(
          "--light-text-color",
          "black"
        );
    } else {
      setBgColor("black");
      window &&
        window.document.documentElement.style.setProperty(
          "--dark-background-color",
          color
        );
      window &&
        window.document.documentElement.style.setProperty(
          "--light-text-color",
          "white"
        );
    }
  });

  const postCollections = userPosts.length > 0 ? userPosts : posts;

  const getDisplayPosts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/display-posts`
      );
      setPosts(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Head>
        <title>
          POSTAHOLIC - A Social Media Website by @agrawallaDarshan
        </title>
        <meta
          name="description"
          content="A Social Media Website developed by @agrawallaDarshan"
        />
        <meta
          property="og:description"
          content="A Social Media Website developed by @agrawallaDarshan in his learning journey"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="POSTAHOLIC" />
        <meta
          property="og:url"
          content="https://mernstack-frontend-24efe.web.app"
        />
        <meta
          property="og:image:secure_url"
          content="https://mernstack-frontend-24efe.web.app/images/street.jpg"
        />
      </Head>

      <div className="container-fluid">
        <h1 className="text-center display-1 py-3">Home</h1>
        <div className="row">
          {loading ? (
            <LoadingOutlined className="display-1" />
          ) : (
            postCollections.map((post) => (
              <div className="col-md-4" key={post._id}>
                <Link href={`/home/${post._id}`}>
                  <a>
                    <HomePagePost key={post._id} post={post} />
                  </a>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
