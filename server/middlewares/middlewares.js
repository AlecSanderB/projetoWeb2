module.exports = {
  sessionControl(req, res, next) {
    const CC_SECRET = "MY_CC_SECRET";

    const isCCRequest = req.headers["x-cc-token"] === CC_SECRET;

    if (req.path.startsWith("/auth")) return next();
    if (req.path === "/" && req.method === "GET") return next();

    if (req.originalUrl.startsWith("/api") && (req.session.login || isCCRequest)) {
      return next();
    }

    return res.status(401).json({ error: "Not authenticated" });
  }

};