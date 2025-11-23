module.exports = {
  sessionControl(req, res, next) {
    function isCCRequest(req) {
      const CC_SECRET = "MY_CC_SECRET";
      return req.headers["x-cc-token"] === CC_SECRET;
    }


    if (req.path.startsWith("/auth")) return next();
    if (req.path === "/" && req.method === "GET") return next();

    if (req.originalUrl.startsWith("/api")) return next();

    if (req.session.login) return next();

    return res.status(401).json({ error: "Not authenticated" });
  }
};