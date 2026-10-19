const app = require("./app");
const connectDB = require("./config/db");
const { port } = require("./config/env");

connectDB();

app.listen(port, "0.0.0.0", () => {
  console.log(`Express server listening on port ${port}`);
});
