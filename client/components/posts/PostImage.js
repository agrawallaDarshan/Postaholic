const PostImage = ({ url }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${url})`,
        height: "350px",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    ></div>
  );
};

export default PostImage;
