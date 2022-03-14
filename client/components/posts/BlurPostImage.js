import Link from "next/link";

const BlurPostImage = ({ url }) => {
  return (
    <div>
      <div
        className="blur"
        style={{
          backgroundImage: `url(${url})`,
          height: "350px",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backdropFilter: "blur(5px)",
        }}
      ></div>
      <Link href="/login">
        <a className="btn btn-primary btn-lg center-over-image">Login</a>
      </Link>
    </div>
  );
};

export default BlurPostImage;
