const { Command } = require("discord.js-commando");
const fs = require("fs");
module.exports = class setRole extends Command {
  constructor(client) {
    super(client, {
      name: "setrole",
      group: "settings",
      memberName: "setrole",
      description: "Update role key values",
      guildOnly: true,
      args: [
        {
          key: "type",
          prompt: "What role key would you like to modify?",
          type: "string",
        },
        {
          key: "role",
          prompt: "What role would you like to set this key to?",
          type: "role",
        },
      ],
    });
  }

  run(message, { type, role }) {
    if (this.client.config.role.hasOwnProperty(type)) {
      let localConf = this.client.config;
      localConf.role[type] = role.id;
      fs.writeFile("./config.json", JSON.stringify(localConf, null, 3), (err) => {
        if (err) throw err;
        message.say("Successfully updated role value!");
      });
      this.client.log(`Role Updated`, `${type} => @${role.name}`, 323295, message);
    } else {
      this.client.error("Could not find that role key", message);
    }
  }
};
