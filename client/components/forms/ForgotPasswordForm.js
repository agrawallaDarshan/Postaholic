import { LoadingOutlined } from "@ant-design/icons";

const ForgotPasswordForm = ({
  changePassword,
  email,
  setEmail,
  newPassword,
  setNewPassword,
  newPasswordAgain,
  setNewPasswordAgain,
  securityQuestion,
  setSecurityQuestion,
  security,
  setSecurity,
  verificationCode,
  setVerificationCode,
  buttonText,
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
    <form onSubmit={changePassword}>
      {(page !== "forgot_security" || buttonText !== "Submit") && (
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
      )}
      {(page !== "forgot_security" || buttonText === "Submit") && (
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
      )}
      {(page !== "forgot_security" || buttonText === "Submit") && (
        <div className="form-group p-2">
          <small>
            <label className="text-muted">Enter your new password again</label>
          </small>
          <input
            value={newPasswordAgain}
            onChange={(e) => {
              setNewPasswordAgain(e.target.value);
            }}
            type="password"
            className="form-control"
            placeholder="Enter your new password again"
          />
        </div>
      )}
      {(page !== "forgot_security" || buttonText === "Submit") && (
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
      {(page !== "forgot_security" || buttonText === "Submit") && (
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
      {page === "forgot_security" && buttonText === "Submit" && (
        <div className="form-group p-2">
          <small>
            <label className="text-muted">Enter your verification code</label>
          </small>
          <input
            value={verificationCode}
            onChange={(e) => {
              setVerificationCode(e.target.value);
            }}
            type="text"
            className="form-control"
          />
        </div>
      )}
      <div className="form-group p-2">
        <button
          disabled={
            page === "forgot_security"
              ? buttonText === "Submit"
                ? !newPassword ||
                  !newPasswordAgain ||
                  !securityQuestion ||
                  !security ||
                  !verificationCode ||
                  loading
                : !email || loading
              : !newPassword ||
                !newPasswordAgain ||
                !securityQuestion ||
                !security ||
                !email ||
                loading
          }
          className="btn btn-primary col-md-12"
        >
          {loading ? (
            <LoadingOutlined spin="true" />
          ) : page === "forgot_security" ? (
            `${buttonText}`
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
