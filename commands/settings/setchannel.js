const { Command } = require("discord.js-commando");
const fs = require("fs");
module.exports = class setChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: "setchannel",
      group: "settings",
      memberName: "setchannel",
      description: "Update channel key values",
      guildOnly: true,
      args: [
        {
          key: "type",
          prompt: "What channel key would you like to modify?",
          type: "string",
        },
        {
          key: "channel",
          prompt: "What channel would you like to set this key to?",
          type: "channel",
        },
      ],
    });
  }

  run(message, { type, channel }) {
    if (this.client.config.channel.hasOwnProperty(type)) {
      let localConf = this.client.config;
      localConf.channel[type] = channel.id;
      fs.writeFile("./config.json", JSON.stringify(localConf, null, 3), (err) => {
        if (err) throw err;
        message.say("Successfully updated channel value!");
      });
      this.client.log(`Channel Updated`, `${type} => #${channel.name}`, 323295, message);
    } else {
      this.client.error("Could not find that channel key", message);
    }
  }
};
