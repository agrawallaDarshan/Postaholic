import axios from "axios";
import HomePagePost from "../../components/posts/HomePagePost";
import Head from "next/head";

const PublicPage = ({ post }) => {
  const imageSource = () => {
    if (post.image.url) {
      return post.image.url;
    } else {
      return "http://merncamp_final_project.com/images/street.jpg";
    }
  };

  return (
    <>
      <Head>
        <title>
          MERNCAMP_FINAL_PROJECT - A social network by devs for devs
        </title>
        <meta name="description" content={post.postContent} />
        <meta
          property="og:description"
          content="A social network app developed by @agrawallaDarshan in his learning journey"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MERNCAMP_FINAL_PROJECT" />
        <meta property="og:url" content="http://merncamp_final_project.com" />
        <meta property="og:image:secure_url" content={imageSource()} />
      </Head>

      <div className="container-fluid p-3">
        <div className="row">
          <div className="offset-md-2 col-md-8">
            <HomePagePost key={post._id} post={post} />
          </div>
        </div>
      </div>
    </>
  );
};

//When we are using server side rendering, inside of router we are gonna use the context as a parameter and access the id as ctx.params._id
export async function getServerSideProps(ctx) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API}/single-public-post/${ctx.params._id}`
  );
  return {
    props: {
      post: data,
    }, // will be passed to the page component as props
  };
}

export default PublicPage;
