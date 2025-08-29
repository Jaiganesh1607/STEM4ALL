module.exports = function requireApprovedInstructor(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const isInstructor = req.user.role === 'instructor';
  const isAdmin = req.user.role === 'admin';
  if (!isInstructor && !isAdmin) {
    return res.status(403).json({ message: 'Forbidden: instructor or admin only' });
  }
  if (isInstructor && !req.user.approved) {
    return res.status(403).json({ message: 'Forbidden: instructor not approved' });
  }
  next();
};
