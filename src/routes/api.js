import { Router, json } from "express";
import {
  getAllUsers,
  getSingleUser,
  logout,
  checkSession,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  newComment,
  getCommentsFromPost,
  deleteComment,
  editComment,
} from "../controllers/users";
import isAuthenticated from "../middleware/isAuthenticated";
import { login, newPost, register, update } from "../controllers/auth";
import isAdmin from "../middleware/isAdmin";
import query from "../database";

const apiROutes = Router();

// user function
apiROutes.get("/users", isAuthenticated, isAdmin, getAllUsers);
apiROutes.get("/users/:username", getSingleUser);
apiROutes.put("/users", isAuthenticated, update);
apiROutes.post("/register", register);
apiROutes.post("/login", login);
apiROutes.get("/logout", isAuthenticated, logout);

apiROutes.get("/sessions", checkSession);

// posts function
apiROutes.get("/post", getAllPosts);
apiROutes.get("/post/:slug", getPost);
apiROutes.post("/post", isAuthenticated, isAdmin, newPost);
apiROutes.put("/post", isAuthenticated, isAdmin, updatePost);
apiROutes.delete("/post", isAuthenticated, deletePost);

// comment function
apiROutes.get("/post/:slug/comment", isAuthenticated, getCommentsFromPost);
apiROutes.post("/post/:slug/comment", isAuthenticated, newComment);
apiROutes.delete("/post/:slug/comment", isAuthenticated, deleteComment);
apiROutes.put("/post/:slug/comment", isAuthenticated, editComment);

export default apiROutes;
