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

export async function getSingleUser(req, res) {
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

export function logout(req, res) {
  const session = req.session.destroy();
  console.log(session);
  res.status(200).json({ message: "Logout successfully" });
}

export function checkSession(req, res) {
  const data = req.sessionStore;
  res.status(200).json({ data });
}

export async function getAllPosts(req, res) {
  const data = await query("SELECT * FROM posts");
  res.status(200).json({ posts: data.rows });
}

export async function getPost(req, res) {
  const title = req.params.slug;
  const data = await query("SELECT * FROM posts WHERE slug = $1", [title]);
  res.status(200).json({ content: data.rows[0] });

  // .catch(function (errDB) {
  //   res.status(404).json({ message: "Post does not exist" });
  // });
}

export async function updatePost(req, res) {
  const user = req.user;
  const { id, title, body } = req.body;
  const slug = title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replaceAll(" ", "-");
  await query(
    "UPDATE posts SET title=$1,body=$2,slug=$3, updated_at = CURRENT_TIMESTAMP WHERE id=$4 AND author_id = $5 ",
    [title, body, slug, id, user]
  )
    .then(function (resDB) {
      res.status(200).json({ message: "Post updated", post: id });
    })
    .catch(function (errDB) {
      res
        .status(500)
        .json({ message: " Server error", error: errDB, user: user });
    });
}

export async function deletePost(req, res) {
  const authID = req.user;
  const { id, title } = req.body;
  await query("DELETE FROM posts WHERE id=$1 AND author_id=$2 AND title=$3 ", [
    id,
    authID,
    title,
  ])
    .then(function (resDB) {
      res.status(200).json({ message: "Post deleted", authID: authID });
    })
    .catch(function (errDB) {
      res.status(400).json({ message: "Got some problems", error: errDB });
    });
}

export async function newComment(req, res) {
  const userID = req.user;
  const title = req.params.slug;
  const { body } = req.body;
  const data = await query("SELECT * FROM posts WHERE slug = $1", [title]);
  if (!data.rows[0]) {
    return res.status(404).json({ message: "Post does not exist" });
  }
  const postID = data.rows[0].id;
  await query(
    "INSERT INTO comments (body, author_id, post_id) VALUES ($1,$2,$3)",
    [body, userID, postID]
  )
    .then(function (resDB) {
      res.status(200).json({ message: "New comment added", post: postID });
    })
    .catch(function (errDB) {
      res.status(500).json({ message: " Server error", error: errDB });
    });
}

export async function getCommentsFromPost(req, res) {
  const title = req.params.slug;
  const post = await query("SELECT * FROM posts WHERE slug = $1", [title]);
  if (!post.rows[0]) {
    return res.status(404).json({ message: "Post does not exist" });
  }
  const postID = post.rows[0].id;
  const data = await query("SELECT * FROM comments WHERE post_id= $1", [
    postID,
  ]);
  res.status(200).json({ comment: data.rows, post: postID, slug: title });
}

export async function deleteComment(req, res) {
  const title = req.params.slug;
  const { id } = req.body;
  const post = await query("SELECT * FROM posts WHERE slug = $1", [title]);
  if (!post.rows[0]) {
    return res.status(404).json({ message: "Post does not exist" });
  }
  const postID = post.rows[0].id;
  const data = await query(
    "SELECT * FROM comments WHERE post_id= $1 AND id = $2",
    [postID, id]
  );
  if (!data.rows[0]) {
    return res.status(404).json({ message: "No such comment" });
  }
  await query("DELETE FROM comments WHERE id = $1", [id]);
  res.status(200).json({ message: "Comment deleted", comment: data.rows });
}

export async function editComment(req, res) {
  const user = req.user;
  const title = req.params.slug;
  const { id, body } = req.body;
  const post = await query("SELECT * FROM posts WHERE slug = $1", [title]);
  if (!post.rows[0]) {
    return res.status(404).json({ message: "Post does not exist" });
  }
  const postID = post.rows[0].id;
  const data = await query(
    "SELECT * FROM comments WHERE post_id= $1 AND id = $2",
    [postID, id]
  );
  if (!data.rows[0]) {
    return res.status(404).json({ message: "No such comment" });
  }
  const comment = await query(
    "UPDATE comments SET body=$1, updated_at = CURRENT_TIMESTAMP WHERE post_id= $2 AND id = $3",
    [body, postID, id]
  );
  res.status(200).json({ message: "Comment updated", body: body });
}
