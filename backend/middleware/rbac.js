const rbacMiddleware = (requiredRoles) => {
    return (req, res, next) => {
      const userRole = req.user?.role; // Role from the decoded JWT in the request (set by jwtAuthMiddleware)
  
      if (!userRole) {
        return res.status(403).json({ message: 'Access denied. No role assigned.' });
      }
  
      if (!requiredRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }
  
      next(); // User has the required role, proceed to the next middleware or route handler
    };
  };
  
  module.exports = rbacMiddleware;