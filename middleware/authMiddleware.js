// middleware/authMiddleware.js
function requireAuth(req, res, next) {

    const isAuthenticated = !!req.session.user_email;

    if (isAuthenticated) {
        next();
    } else {
        return res.redirect("/login");
    }
}

function logExecutionTime(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${duration}ms`);
  });
  next();
}

module.exports = { requireAuth, logExecutionTime };
