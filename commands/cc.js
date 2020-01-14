exports.run = (client, message, args, cc) => {
  const error = require("../modules/errorMod.js");
  const fs = require("fs");
  let msg = args.join(" ").replace(args[0], "");
  msg = msg.replace(/\s/, "");
  msg = msg.replace(args[1], "");
  msg = msg.trim();
  const isAdmin = require("../modules/isAdmin.js");
  if (client.isAdmin(message.author, message, true, client)) {
    if (args[0] === "add") {
      cc.defer.then(() => {
        cc.set(`${args[1]}`, msg);
        message.channel.send(`Command \`${client.ConfigService.config.prefix}${args[1]}\` created with response \`${cc.get(args[1])}\``);
      });
    }

    if (args[0] === "del") {
      cc.defer.then(() => {
        if (cc.has(args[1])) {
          cc.delete(args[1]);
          message.channel.send(`Deleted command \`${client.ConfigService.config.prefix}${args[1]}\``);
        } else {
          return client.error(`Command \`${args[1]}\` does not exist!`, message);
        }
      });
    }
    if (args[0] === "list") {
      cc.defer.then(() => {
        // let CMDS = cc.fetchEverything();
        // message.channel.send(CMDS);
        // let keys = Array.from(cc.keys());
        // let values = Array.from(cc.values());
        let keys = cc.keyArray();
        let values = cc.array();
        let msg = "";
        for (i in keys) {
          msg += `${keys[i]} - ${values[i]}\n`;
        }
        if (msg == "") {
          return message.channel.send("No custom commands.");
        } else {
          return message.channel.send(`\`\`\`Total Commands: ${cc.size}\n${msg}\`\`\``);
        }
      });
    }
    if (!args[0]) {
      message.channel.send(`${client.ConfigService.config.prefix}cc [add | del | list] [commandname] [text if adding command]`, {
        code: "asciidoc"
      });
    }
  }
};

exports.cmd = {
  enabled: true,
  category: "Admin",
  level: 2,
  description: "Allows admins to manage the custom commands of the bot."
};
