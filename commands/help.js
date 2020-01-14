exports.run = (client, message, args) => {
  const fs = require("fs");

  const embed = {
    description: "Hello! I am ModMail. I am a safe way for you to message Discord server staff. For more info I have direct messaged you a list of commands.",
    color: 3398293,
    author: {
      name: "ModMail",
      icon_url: `${client.user.avatarURL}`
    },
    fields: [
      {
        name: "Usage",
        value:
          "Just direct message me any concerns, a support ticket will be created and a staff member will respond when convenient. You can continue to add/reply to your ticket by continuing to DM me. Your ticket will be closed by a staff member after you have been helped. Thank you!"
      },
      {
        name: "Prefix",
        value: `\`${client.ConfigService.config.prefix}\``
      }
    ]
  };
  message.channel.send({ embed });
  let commands = fs.readdirSync("./commands/");
  let cmds = [];

  function getCmds(category) {
    commands.forEach(function(file) {
      if (file == ".DS_Store" || !file.includes(".js")) return;
      //command name
      let name = file.split(".")[0];
      let data = require(`../commands/${file}`).cmd;
      if (!data) return client.console(`No cmd object for ${file}`, "error", "help command");
      //description
      let val = data.enabled ? data.description : "*" + data.description;
      let template = `> ${client.ConfigService.config.prefix}${name}\n‣\`${val}\`\n`;
      if (data.category == category) {
        cmds.push(template);
      }
    });
    let embed = {
      description: cmds.join(""),
      author: {
        name: category + " Commands"
      },
      footer: {
        text: `${client.user.username}`
      }
    };

    return { embed };
  }

  message.channel.send(getCmds("Utility"));
  cmds = [];
  if (message.channel.type == "dm") return;
  if (client.isAdmin(message.author, message, false)) message.channel.send(getCmds("Admin"));
  cmds = [];
  if (client.isMod(message.author, message)) message.channel.send(getCmds("Moderator"));
};

exports.cmd = {
  enabled: true,
  category: "Utility",
  level: 0,
  description: "Show bot commands and features"
};
