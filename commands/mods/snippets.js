const { Command } = require("discord.js-commando");
const fs = require("fs");
const { isFunction } = require("util");

module.exports = class snippetsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "snippets",
      group: "mods",
      memberName: "snippets",
      guildOnly: true,
      description: 'View, create, and delete snippets that can be used as "quickreplies" in ModMail channels. Use a snippet in the ModMail channel by typing `snippet [#]`',
      examples: ["snippets create Thank you for your question! We will get back to you as soon as possible", "snippets delete 0", "snippets"],
    });
  }

  run(message) {
    let t = this;
    let option = message.content.split(" ").slice(1)[0];
    let arg = message.content.split(" ").slice(2).join(" ");

    // async function configArrayPush(property, value) {
    //   let data = require("../../config.json");
    //   await data[property].push(value);
    //   fs.writeFile("./config.json", JSON.stringify(data, null, 3), (err) => {
    //     if (err) return;
    //   });
    // }
    async function configArrayPush(property, value) {
      let data = t.client.config;
      await data[property].push(value);
      fs.writeFile("./config.json", JSON.stringify(data, null, 3), (err) => {
        if (err) return t.client.cn.error("Config", err);
        t.client.cn.log("Config", `The config file has been saved! Added to property ${property} new value ${value}`);
      });
      t.client.config = await require("../../config.json");
    }

    // async function configArrayRemove(property, value) {
    //   let data = require("../../config.json");
    //   data[property] = await data[property].filter(function (val, index, arr) {
    //     return val !== require("../../config.json").snippets[arg];
    //   });
    //   fs.writeFile("./config.json", JSON.stringify(data, null, 3), (err) => {
    //     if (err) return;
    //   });
    // }

    async function configArrayRemove(property, value) {
      let data = t.client.config;
      data[property] = await data[property].filter(function (val, index, arr) {
        return val !== t.client.config.snippets[arg];
      });
      fs.writeFile("./config.json", JSON.stringify(data, null, 3), (err) => {
        if (err) return t.client.cn.error("Config", err);
        t.client.cn.log("Config", `The config file has been saved! Removed in property ${property} removed value ${value}`);
      });
      t.client.config = await require("../../config.json");
    }
    switch (option) {
      case "create":
        configArrayPush("snippets", arg);
        message.channel.send(`Successfully created snippet (ID: \`${this.client.config.snippets.indexOf(arg)}\`) with content \`\`\`${arg}\`\`\``);
        break;
      case "delete":
        if (!this.client.config.snippets[arg]) return this.client.error(`Could not find that snippet ID! Run \`${this.client.config.prefix}snippets\` to view all snippets loaded!`, message);
        configArrayRemove("snippets", arg);
        message.channel.send(`Successfully Removed snippet (ID: \`${arg}\`) with content \`\`\`${this.client.config.snippets[arg]}\`\`\``);
        break;
      default:
        let chunk = "";

        this.client.config.snippets.forEach((snip) => {
          chunk += `[${this.client.config.snippets.indexOf(snip)}] :: ${snip}\n`;
        });
        if (this.client.config.snippets.length == 0) chunk = `No Snippets. Create some with ${this.client.config.prefix}snippets create <Text for snippet>`;
        message.channel.send(`\`\`\`\n${chunk}\`\`\``);
        break;
    }
  }
};
