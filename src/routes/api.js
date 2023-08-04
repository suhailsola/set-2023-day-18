import { Router } from "express";
import { getAllUsers, getSingleUsers } from "../controllers/users";
import isAuthenticated from "../middleware/isAuthenticated";
import { login, register, update } from "../controllers/auth";
import isAdmin from "../middleware/isAdmin";

const apiROutes = Router();

apiROutes.get("/users", isAuthenticated, isAdmin, getAllUsers);
apiROutes.get("/users/:username", getSingleUsers);

apiROutes.put("/users", isAuthenticated, update);

apiROutes.post("/register", register);
apiROutes.post("/login", login);

export default apiROutes;
