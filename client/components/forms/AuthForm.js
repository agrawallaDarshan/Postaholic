import { LoadingOutlined, CameraFilled } from "@ant-design/icons";
import { Avatar } from "antd";

const AuthForm = ({
  handleSubmit,
  image,
  handleImage,
  uploading,
  name,
  setName,
  email,
  setEmail,
  username,
  setUsername,
  password,
  setPassword,
  securityQuestion,
  setSecurityQuestion,
  security,
  setSecurity,
  loading,
  page,
  about,
  setAbout,
  isUpdatePage,
}) => {
  const questionsArray = [
    "Please select a security question.",
    "What is your favorite color?",
    "What is your favorite food?",
    "What is the last name of your School's Principal?",
  ];

  return (
    <form onSubmit={handleSubmit}>
      {(page !== "login" || isUpdatePage) && (
        <>
          <div className="d-flex justify-content-center my-2">
            <label>
              {uploading ? (
                <LoadingOutlined />
              ) : image && image.url ? (
                <Avatar size={80} src={image.url} shape="circle" />
              ) : (
                <CameraFilled />
              )}
              <input
                //Used the accept tag to specify the content of file which this input field will accept
                onChange={handleImage}
                type="file"
                accept="image/*"
                hidden
              />
            </label>
          </div>
          <div className="d-flex justify-content-center">
            <small>
              <label className="text-muted">
                Click the above icon to update image
              </label>
            </small>
          </div>
        </>
      )}
      {page !== "login" && (
        <div className="form-group p-2">
          <small>
            <label className="text-muted">Your Name</label>
          </small>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            type="text"
            className="form-control"
            placeholder="Enter your name"
          />
        </div>
      )}

      <div className="form-group p-2">
        <small>
          <label className="text-muted">Enter your Email</label>
        </small>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
          className="form-control"
          placeholder="Enter your email address"
          disabled={isUpdatePage}
        />
      </div>

      {page !== "login" && (
        <div className="form-group p-2">
          <small>
            <label className="text-muted">Enter your Username</label>
          </small>
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            className="form-control"
            placeholder="Enter your Username"
          />
        </div>
      )}

      {isUpdatePage && (
        <div className="form-group p-2">
          <small>
            <label className="text-muted">Write about yourself..</label>
          </small>
          <textarea
            value={about}
            onChange={(e) => {
              setAbout(e.target.value);
            }}
            type="text"
            className="form-control"
            placeholder="Write about yourself"
          />
        </div>
      )}

      {!isUpdatePage && (
        <div className="form-group p-2">
          <small>
            <label className="text-muted">Enter your Password</label>
          </small>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            className="form-control"
            placeholder="Enter your password"
          />
        </div>
      )}

      {page !== "login" && !isUpdatePage && (
        <div className="form-group p-2">
          <small>
            <label className="text-muted">Pick a question</label>
          </small>
          <select
            className="form-control"
            defaultValue={0}
            onChange={(e) => {
              setSecurityQuestion(questionsArray[parseInt(e.target.value)]);
            }}
          >
            <option value="0">Please select a security question.</option>
            <option value="1">What is your favorite color?</option>
            <option value="2">What is your favorite food?</option>
            <option value="3">
              What is the last name of your School's Principal?
            </option>
          </select>
          <small className="text-muted">
            You can use this as a security question to reset your password
          </small>
        </div>
      )}

      {page !== "login" && !isUpdatePage && (
        <div className="form-group p-2">
          <small>
            <label className="text-muted">Enter your answer</label>
          </small>
          <input
            value={security}
            onChange={(e) => {
              setSecurity(e.target.value);
            }}
            type="text"
            className="form-control"
          />
        </div>
      )}

      <div className="form-group p-2">
        <button
          disabled={
            isUpdatePage
              ? loading || !name || !username
              : page !== "login"
              ? !name || !password || !email || !security || loading
              : !email || !password || loading
          }
          className="btn btn-primary col-md-12"
        >
          {loading ? <LoadingOutlined spin="true" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
