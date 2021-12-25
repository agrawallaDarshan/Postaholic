import { LoadingOutlined } from "@ant-design/icons";
import { useEffect } from "react";

const AuthForm = ({
  handleSubmit,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  securityQuestion,
  setSecurityQuestion,
  security,
  setSecurity,
  loading,
  page,
}) => {
  const questionsArray = [
    "Please select a security question.",
    "What is your favorite color?",
    "What is your favorite food?",
    "What is the last name of your School's Principal?",
  ];

  return (
    <form onSubmit={handleSubmit}>
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
        />
      </div>

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

      {page !== "login" && (
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

      {page !== "login" && (
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
            page !== "login"
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
