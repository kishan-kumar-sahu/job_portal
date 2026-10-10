export const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.role || !allowedRoles.includes(req.role)) {
    return res.status(403).json({ success: false, message: "You do not have permission to perform this action." });
  }
  next();
};
