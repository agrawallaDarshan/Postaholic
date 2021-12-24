const bcrypt = require("bcrypt");

const saltRounds = 12;

const hashPassword = (userPassword) => {
  return new Promise((accept, decline) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        decline(err);
      } else {
        bcrypt.hash(userPassword, salt, (err, hashedPassword) => {
          if (err) {
            decline(err);
          } else {
            accept(hashedPassword);
          }
        });
      }
    });
  });
};

const comparePassword = (userPassword, hashedPassword) => {
  return bcrypt.compare(userPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
