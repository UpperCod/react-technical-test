const jwt = require("jsonwebtoken");

exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      token: jwt.sign({ rol: "admin" }, "uppercod"),
    }),
  };
};
