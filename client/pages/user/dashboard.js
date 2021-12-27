import { useContext } from "react";
import { UserContext } from "../../context/index";
import UserValidation from "../../components/routes/userRoute";
import PostForm from "../../components/forms/PostForm";

const Home = () => {
  return (
    <UserValidation>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <h1 className="display-1 text-center">Dashboard Page</h1>
          </div>
        </div>
        <div className="row p-3">
          <div className="col-md-8">
            <PostForm />
          </div>
          <div className="col-md-4">Slidebar</div>
        </div>
      </div>
    </UserValidation>
  );
};

export default Home;
