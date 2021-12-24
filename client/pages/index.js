import { UserContext } from "../context/index";
import { useContext } from "react";

const Home = () => {
  const [state, setState] = useContext(UserContext);

  return (
    <div>
      <h1 className="text-center display-1 py-3">
        Home Page
      </h1>
      <img src="/images/street.jpg" alt="" />
    </div>
  );
};

export default Home;
