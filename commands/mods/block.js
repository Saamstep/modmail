const { Command } = require("discord.js-commando");
const fs = require("fs");

module.exports = class blockCommand extends Command {
  constructor(client) {
    super(client, {
      name: "block",
      group: "mods",
      memberName: "block",
      guildOnly: true,
      description: "Block or unblock a user from using ModMail.",
      args: [{ key: "user", prompt: "Please type a user to block or unblock", type: "user" }],
    });
  }

  run(message, { user }) {
    let t = this;

    async function configArrayPush(property, value) {
      let data = t.client.config;
      await data.modmail[property].push(value);
      fs.writeFile("./config.json", JSON.stringify(data, null, 3), (err) => {
        if (err) return t.client.cn.error("Config", err);
        t.client.cn.log("Config", `The config file has been saved! Added to property ${property} new value ${value}`);
      });
      t.client.config = await require("../../config.json");
    }

    async function configArrayRemove(property, value) {
      let data = t.client.config;
      data.modmail[property] = await data.modmail[property].filter(function (val, index, arr) {
        return val !== value;
      });
      fs.writeFile("./config.json", JSON.stringify(data, null, 3), (err) => {
        if (err) return t.client.cn.error("Config", err);
        t.client.cn.log("Config", `The config file has been saved! Removed in property ${property} removed value ${value}`);
      });
      t.client.config = await require("../../config.json");
    }

    if (this.client.config.modmail.blockedUsers.indexOf(user.id) > -1) {
      // unblock them
      configArrayRemove("blockedUsers", user.id);
      this.client.log("User Unblocked", `${user.tag} (ID: \`${user.id}\`) has been unblocked`, 82938, message);
      message.channel.send(`${user} successfully unblocked.`);
    } else {
      // block
      configArrayPush("blockedUsers", user.id);
      this.client.log("User Blocked", `${user.tag} (ID: \`${user.id}\`) has been blocked`, 82938, message);
      message.channel.send(`${user} successfully blocked.`);
    }   
  }
};
