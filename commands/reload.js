exports.run = (client, message, args) => {
  const ConfigService = require("../config.js");

  let isMod = require("../modules/isMod.js");
  if (isMod(message.author, message)) {
    if (args[1] == null) {
      return message.channel.send(`${ConfigService.config.prefix}reload [commandName]`, {
        code: "acsiidoc"
      });
    }
    // the path is relative to the *current folder*, so just ./filename.js

    if (args) {
      delete require.cache[require.resolve(`./${args[0]}.js`)];
      message.reply(`The command ${args[0]} has been reloaded`);
    }
  }
};

exports.cmd = {
  enabled: true,
  category: "Moderator",
  level: 1,
  description: "Desc"
};
