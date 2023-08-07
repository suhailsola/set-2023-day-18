import { async } from "regenerator-runtime";
import query from "../../database";
import bcrypt from "bcryptjs";
import config from "../../config";

export async function register(req, res) {
  // receive data from body
  const { email, username, password } = req.body;
  const isAdmin = req.body?.is_admin ? true : false;

  //   if (!password) {
  //     console.log(password);
  //     return res.status(404).json({ message: "password not found" });
  //   }
  const hashedPassword = hashPassword(password);
  console.log(password);
  //   insert hashed password data into db
  await query(
    "INSERT INTO users (email, username, password, isAdmin) VALUES ($1, $2, $3, $4)",
    [email, username, hashedPassword, isAdmin]
  )
    .then(function (resDb) {
      res.status(200).json({ message: "A user created" });
    })
    .catch(function (errDb) {
      res.status(500).json({ message: "Server error", error: errDb });
    });
}

export async function login(req, res) {
  const { identifier, password } = req.body;
  const data = await query(
    "SELECT * FROM users WHERE username=$1 OR email=$1",
    [identifier]
  );
  const [user] = data.rows;
  if (!user) {
    res
      .status(400)
      .json({ message: "Login Unsuccesful", error: "Invalid credentials" });
    return;
  }

  // create function

  //   compare hashed password
  bcrypt.compare(password, user.password, (error, bcryptRes) => {
    if (bcryptRes) {
      req.session.auth = user.id;
      const serverRes = {
        message: "Login Succesful",
        data: user,
        session: req.session,
      };
      res.status(200).json(serverRes);
    } else {
      const serverRes = {
        message: "Login Unsuccesful",
        error: "Invalid credentials",
        data: error,
      };
      res.status(401).json(serverRes);
    }
  });

  //   res.status(200).json({ message: "Login successful", user });
}

export async function update(req, res) {
  const user = req.user;
  const body = req.body;

  const columns = [];
  const values = [];
  let paramIndex = 1;

  // Construct the SET clause for the SQL query
  Object.entries(body).forEach(([key, value]) => {
    columns.push(`${key} = $${paramIndex}`);
    if (key === "password") {
      values.push(hashPassword(value));
    } else {
      values.push(value);
    }
    paramIndex++;
  });
  columns.push("updated_at = CURRENT_TIMESTAMP");

  const queryStr = `UPDATE users SET ${columns.join(
    ", "
  )} WHERE id = $${paramIndex}`;
  values.push(user.id);
  const data = query(queryStr, values);
  res.status(200).json({ message: "Username updated", data });
}

//   hashed password data from body

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
}

// add new post
export async function newPost(req, res) {
  const userID = req.user;
  const { title, body } = req.body;
  const slug = title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replaceAll(" ", "-");

  await query(
    "INSERT INTO posts (author_id, title, body, slug) VALUES ($1,$2,$3, $4)",
    [userID, title, body, slug]
  )
    .then(function (resDB) {
      res.status(200).json({ message: "New post added" });
    })
    .catch(function (errDB) {
      res.status(500).json({ message: " Server error", error: errDB });
    });
}
