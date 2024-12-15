const permissionsMap = require("../utils/PermissionMap.json");

const PermissionsController = {
    getPermissions: async (req, res) => {
        try {
            res.json(permissionsMap);
        } catch (error) {
            console.error("Błąd pobierania mapy uprawnień:", error);
            res.status(500).json({ error: "Błąd serwera" });
        }
    }
};

module.exports = PermissionsController;