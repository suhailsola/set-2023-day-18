import query from "../database";

async function isAdmin(req, res, next) {
  const data = await query("SELECT isadmin from users WHERE id = $1", [
    req.user,
  ]);
  const [users] = data.rows;
  if (users.isadmin) {
    next();
  } else {
    res.status(403).json({
      message: "Not an admin",
      req: req.user,
      user: users,
      body: req.data,
    });
  }
}

export default isAdmin;
