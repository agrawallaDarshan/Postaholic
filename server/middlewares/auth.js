const expressJwt = require("express-jwt");
const secretCode = process.env.JWT_SECRET_CODE;
//expressJwt module is used to extract the JWT from Authorization Header as an OAuth2 Bearer token if the token is valid
//This module provides Express middleware for validating JWTs (JSON Web Tokens) through the jsonwebtoken module. The decoded JWT payload is available on the request object.
const requireSignIn = expressJwt({
  secret: secretCode,
  algorithms: ["HS256"],
});

module.exports = [requireSignIn];
