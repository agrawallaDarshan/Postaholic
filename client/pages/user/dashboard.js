import { useContext } from "react";
import { UserContext } from "../../context/index";
import UserValidation from "../../components/routes/userRoute";

const Home = () => {
  return (
    <UserValidation>
      <div className="container">
        <div className="row">
          <div className="col">
            <h1 className="display-1 text-center">Dashboard Page</h1>
          </div>
        </div>
      </div>
    </UserValidation>
  );
};

export default Home;
