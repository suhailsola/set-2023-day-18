import query from "../database";

async function isAdmin(req, res, next) {
  const data = await query("SELECT is_admin from users WHERE id = $1", [
    req.user.id,
  ]);
  const [users] = data.rows;
  if (users.is_admin) {
    next();
  } else {
    res.status(403).json({ message: "Not an admin" });
  }
}

export default isAdmin;
