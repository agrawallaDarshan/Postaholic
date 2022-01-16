import { LoadingOutlined } from "@ant-design/icons";
import { Divider } from "antd";

const UpdatePassword = ({
  handleSubmit,
  currentPassword,
  setCurrentPassword,
  securityQuestion,
  setSecurityQuestion,
  security,
  setSecurity,
  newPassword,
  setNewPassword,
  loading,
}) => {
  const questionsArray = [
    "Please select a security question.",
    "What is your favorite color?",
    "What is your favorite food?",
    "What is the last name of your School's Principal?",
  ];
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group p-2">
        <small>
          <label className="text-muted">Enter your current password</label>
        </small>
        <input
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
          }}
          type="password"
          className="form-control"
          placeholder="Enter your current password"
          disabled={
            (securityQuestion &&
              securityQuestion !== "Please select a security question.") ||
            security
          }
        />
      </div>
      <Divider orientation="center">OR</Divider>
      <div className="form-group p-2">
        <small>
          <label className="text-muted">Choose your question</label>
        </small>
        <select
          className="form-control"
          defaultValue={0}
          onChange={(e) => {
            setSecurityQuestion(questionsArray[parseInt(e.target.value)]);
          }}
          disabled={currentPassword}
        >
          <option value="0">Please select a security question.</option>
          <option value="1">What is your favorite color?</option>
          <option value="2">What is your favorite food?</option>
          <option value="3">
            What is the last name of your School's Principal?
          </option>
        </select>
        <small className="text-muted">
          Choose the same question which you choosed during registration
        </small>
      </div>
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
          disabled={currentPassword}
        />
      </div>
      <Divider orientation="center">AND</Divider>
      <div className="form-group p-2">
        <small>
          <label className="text-muted">Enter your new password</label>
        </small>
        <input
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
          type="password"
          className="form-control"
          placeholder="Enter your new password"
        />
      </div>
      <div className="form-group p-2">
        <button
          disabled={
            !newPassword || (!currentPassword && !securityQuestion && !security)
          }
          className="btn btn-primary col-md-12"
        >
          {loading ? <LoadingOutlined spin="true" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default UpdatePassword;
