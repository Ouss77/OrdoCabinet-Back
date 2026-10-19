const dns = require("node:dns");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const env = {
  port: process.env.PORT || 3002,
  mongoUri: process.env.MONGODB_URI,
  clientOrigin: process.env.CLIENT_ORIGIN || "*",
};

if (!env.mongoUri) {
  console.error("MONGODB_URI is missing. Add it to OrdoCabinet-back/.env");
  process.exit(1);
}

module.exports = env;
