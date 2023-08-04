import { async } from "regenerator-runtime";
import query from "../../database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

export async function getAllUsers(req, res) {
  const data = await query("SELECT * from users");
  const users = data.rows;
  res.status(200).json({ users: users });
}

export async function getSingleUsers(req, res) {
  const username = req.params.username;
  const data = await query("SELECT username from users WHERE username=$1", [
    username,
  ]);
  const [user] = data.rows;
  if (!user) {
    res.status(400).json({ message: "User not found" });
  } else {
    res.status(200).json({ name: user.username });
  }
}


