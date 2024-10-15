const { v4: uuidv4 } = require("uuid");
const UAParser = require("ua-parser-js");

function clientInfoMiddleware(req, res, next) {
  // Client ID
  let clientId = req.cookies.clientId;

  if (!clientId) {
    clientId = uuidv4();
    res.cookie("clientId", clientId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      sameSite: "none",
    });
  }
  req.clientId = clientId;

  // Device Info
  const parser = new UAParser(req.headers["user-agent"]);

  const deviceInfo = {
    browser: parser.getBrowser().name,
    os: parser.getOS().name,
    device: parser.getDevice().type || "desktop",
  };
  req.deviceInfo = deviceInfo;

  // IP Address

  req.ipAddress = req.ip || req.connection.remoteAddress;

  next();
}

module.exports = clientInfoMiddleware;
