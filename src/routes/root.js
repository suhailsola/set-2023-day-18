import express from "express";
import getRoot from "../controllers/root/getRoot";
import postRoot from "../controllers/root/postRoot";
import isAuthenticated from "../middleware/isAuthenticated";

const root = express.Router();

root.get("/", getRoot);
root.post("/", postRoot);
root.get("/public", function (req, res) {
  res.status(200).json({ message: "Hello Public" });
});

root.get("/private", isAuthenticated, function (req, res) {
  res.status(200).json({ message: "Hello private", user: req.user });
});

export default root;
