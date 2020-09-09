exports.run = (client, sendMessage) => {
  //tests if process is alive with http server
  const types = ["READY", "CONNECTING", "RECONNECTING", "IDLE", "NEARLY", "DISCONNECTED"];
  const express = require("express");
  const cors = require("cors");
  const helmet = require("helmet");
  const app = express();
  const invalidAPIKey = { error: "Invalid API Key" };

  app.use(express.json());
  app.use(cors());
  app.use(helmet());

  app.all("/", (req, res) => {
    if (req.headers["key"] != client.config.apiKeys.api) return res.status(401).send(invalidAPIKey);
    const alive = {
      status: `${types[client.ws.status]}`,
      bot: `${client.user.tag}`,
      api_ping: `${client.ws.ping}`,
      uptime: `${client.uptime}`,
    };
    res.status(200).send(alive);
  });
  app.listen(4000, () => {
    client.cn.log("Uptime", "Listening at port 4000");
  });
};
