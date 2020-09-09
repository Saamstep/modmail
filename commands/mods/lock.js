const { Command } = require("discord.js-commando");
const fs = require("fs");

module.exports = class lockBotCommand extends Command {
  constructor(client) {
    super(client, {
      name: "lock",
      group: "mods",
      memberName: "lock",
      guildOnly: true,
      description: "Toggle ModMail ticketing system. When disabled, normal users will not be able to send messages to ModMail, but staff roles will be able to send messages. When enabled, normal users can use ModMail as designed.",
    });
  }

  run(message) {
    let t = this;
    async function updateConfigProp(property, value) {
      let data = t.client.config;
      data.modmail[property] = value;
      fs.writeFile("./config.json", JSON.stringify(data, null, 3), (err) => {
        if (err) return t.client.cn.error("Config", err);
        t.client.cn.log("Config", `The config file has been saved! Updated property ${property} to value ${value}`);
      });
      t.client.config = await require("../../config.json");
    }

    if (this.client.config.modmail.enabled) {
      updateConfigProp("enabled", false);
      this.client.log("ModMail Locked", `ModMail has been locked by a user in #${message.channel.name}`, 968392, message);
      message.channel.send("🔒 Locked ModMail.");
    } else {
      updateConfigProp("enabled", true);
      this.client.log("ModMail Unlocked", `ModMail has been unlocked by a user in #${message.channel.name}`, 968392, message);
      message.channel.send("🔓 Unlocked ModMail.");
    }
  }
};
