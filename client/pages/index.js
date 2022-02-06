import { UserContext } from "../context/index";
import { useContext } from "react";
import axios from "axios";
import HomePagePost from "../components/posts/HomePagePost";
import Head from "next/head";
import Link from "next/link";

const Home = ({ posts }) => {
  const [state, setState] = useContext(UserContext);

  return (
    <>
      <Head>
        <title>
          MERNCAMP_FINAL_PROJECT - A social network by devs for devs
        </title>
        <meta
          name="description"
          content="A social network app developed by @agrawallaDarshan as a project"
        />
        <meta
          property="og:description"
          content="A social network app developed by @agrawallaDarshan in his learning journey"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MERNCAMP_FINAL_PROJECT" />
        <meta property="og:url" content="http://merncamp_final_project.com" />
        <meta
          property="og:image:secure_url"
          content="http://merncamp_final_project.com/images/street.jpg"
        />
      </Head>
      <div className="container-fluid">
        <h1 className="text-center display-1 py-3">Home page</h1>
        <div className="row">
          {posts.map((post) => (
            <div className="col-md-4">
              <Link href={`/home/${post._id}`}>
                <a>
                  <HomePagePost key={post._id} post={post} />
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get("http://localhost:8000/api/display-posts");
  return {
    props: {
      posts: data,
    }, // will be passed to the page component as props
  };
}

export default Home;
