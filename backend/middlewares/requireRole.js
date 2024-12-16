const requireRole = (roles) => (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({message: 'Nie jesteś zalogowany'});
    }

    const userRoles = req.user.guildRoles || [];
    const hasRequiredRole = roles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
        return res.status(403).json({message: 'Brak wymaganych uprawnień'});
    }

    next();

};

module.exports = requireRole;