exports.run = (client, message, args) => {
  const isOwner = require("../modules/isOwner.js");

  const cooldown = require("../index.js");

  function cmd() {
    message.channel.send("Pinging...").then(sent => {
      sent.edit(`Pong! Response time: ${sent.createdTimestamp - message.createdTimestamp}ms`);
    });
  }

  if (isOwner(message, false)) {
    message.channel.send("Pinging...").then(sent => {
      sent.edit(`Pong! Response time: ${sent.createdTimestamp - message.createdTimestamp}ms`);
    });
  } else {
    return cooldown(message, cmd);
  }
};
exports.cmd = {
  enabled: true,
  category: "Utility",
  level: 0,
  description: "Pings the bot, gets response time."
};
