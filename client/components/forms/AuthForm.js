import { LoadingOutlined } from "@ant-design/icons";

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
            onChange={(e) => {
              console.log(e.target.value);
              // setSecurityQuestion(e.target.value);    // e.target[0]
            }}
          >
            <option value="color">What is your favorite color?</option>
            <option value="food">What is your favorite food?</option>
            <option value="principal">
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
              ? !name || !password || !email || !security
              : !email || !password
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
