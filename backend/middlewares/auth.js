const jwt = require("jsonwebtoken");

// const { NODE_ENV, JWT_SECRET } = process.env;

const extractBearerToken = (header) => {
  return header.replace("Bearer ", "");
};

const handleAuthError = (res) => {
  res.status(401).send({ message: "Необходимо авторизироваться" });
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(req.headers);
  if (!authorization && !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Необходимо авторизироваться" });
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(
      token,
      //временно!!!
      "super-strong-secret"
    );
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};
