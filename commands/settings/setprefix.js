const { Command } = require("discord.js-commando");
const fs = require("fs");
module.exports = class setPrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: "setprefix",
      group: "settings",
      memberName: "setprefix",
      description: "Change the server prefix (mention will always work)",
      guildOnly: true,
      args: [
        {
          key: "newPrefix",
          prompt: "Please choose the new prefix you want to set.",
          type: "string",
        },
      ],
    });
  }

  run(message, { newPrefix }) {
    if (this.client.config.prefix !== newPrefix) {
      let localConf = this.client.config;
      localConf.prefix = newPrefix;
      fs.writeFile("./config.json", JSON.stringify(localConf, null, 3), (err) => {
        if (err) throw err;
        message.say(`Successfully updated prefix to \`${newPrefix}\``);
      });
      this.client.log(`Prefix Updated`, `New value: **${newPrefix}**`, 323295, message);
    } else {
      this.client.error("That already is the current prefix!", message);
    }
  }
};
