const expressJwt = require("express-jwt");

//expressJwt module is used to extract the JWT from Authorization Header as an OAuth2 Bearer token if the token is valid

const requireSignIn = expressJwt({
  secret: "JNALKFNAHNAFKLNOAHNkajbfkabibMNuhHHH",
  algorithms: ["HS256"],
});

module.exports = [requireSignIn];
