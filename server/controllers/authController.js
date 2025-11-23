const db = require("../config/db_sequelize");

module.exports = {
  async login(req, res) {
    try {
      const { login, password } = req.body;

      if (!login || !password)
        return res.status(400).json({ error: "Missing credentials" });

      const user = await db.Users.findOne({
        where: { login, password },
        attributes: ["id", "login", "role_id"]
      });

      if (!user)
        return res.status(401).json({ error: "Invalid username or password" });

      req.session.userId = user.id;
      req.session.login = user.login;

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "Login error", details: error.message });
    }
  },

  async logout(req, res) {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  },

  async me(req, res) {
    if (!req.session.userId)
      return res.status(401).json({ error: "Not logged in" });

    try {
      const user = await db.Users.findByPk(req.session.userId, {
        attributes: ["id", "login", "role_id"]
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      return res.json(user.get());
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch user", details: err.message });
    }
  }
};