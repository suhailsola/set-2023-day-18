import jwt from "jsonwebtoken";
import config from "../config";

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) return res.status(401).json({ message: "Unauthorised" });

  jwt.verify(token, config.jwtSecretToken, (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorised" });
    req.user = user;
    next();
  });
};

export default isAuthenticated;
