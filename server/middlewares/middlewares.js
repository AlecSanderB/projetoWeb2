module.exports = {
  sessionControl(req, res, next) {
    function isCCRequest(req) {
      const CC_SECRET = "MY_CC_SECRET";
      return req.headers["x-cc-token"] === CC_SECRET;
    }

    if (req.originalUrl.startsWith("/api")) return next();

    if (req.session.login) return next();
    if (req.url === "/" && req.method === "GET") return next();
    if (req.url === "/login" && req.method === "POST") return next();
    if (req.url.split("/")[1] === "recuperarSenha") return next();
    if (req.url === "/updateChest" && isCCRequest(req)) return next();

    return res.redirect("/");
  }
};