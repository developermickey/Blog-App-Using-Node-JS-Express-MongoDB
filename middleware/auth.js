const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ attaches { userId, role, iat, exp } to request
    next();
  } catch (err) {
    console.error(err);
    return res.redirect("/login");
  }
};
