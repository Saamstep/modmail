const Discord = require("discord.js");
const client = new Discord.Client({ autoReconnect: true });
const ConfigService = require("./config.js");
const fs = require("fs");

//modules init.
client.isAdmin = require("./modules/isAdmin.js");
client.isMod = require("./modules/isMod.js");
client.isOwner = require("./modules/isOwner.js");
client.error = require("./modules/errorMod.js");
client.console = require("./modules/consoleMod.js");
client.log = require("./modules/logMod.js");
client.ConfigService = require("./config.js");

client.login(client.ConfigService.config.token);

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
  if (err) return client.console(err);
  files.forEach(file => {
    if (file.startsWith(".")) {
      return;
    }
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});

//cooldown
const talkedRecently = new Set();
module.exports = function cooldown(message, code) {
  const error = require("./modules/errorMod.js");

  if (talkedRecently.has(message.author.id)) {
    return error("Wait 6 seconds before typing this again.", message);
  } else {
    code();
    talkedRecently.add(message.author.id);
    setTimeout(() => {
      talkedRecently.delete(message.author.id);
    }, 6000);
  }
};

let guild = "";
let admin = "";

client.on("ready", () => {
  guild = client.guilds.get(`${client.ConfigService.config.guildID}`);
  admin = guild.roles.find(r => r.name == `${client.ConfigService.config.role.admin}`);
});

client.on("message", message => {
  //message template for user DM and guild channel(s)
  const msgTemplate = `[**${message.author.username}**] ` + message.content;
  //commands system
  if (message.channel.type == "text" && message.content.startsWith(client.ConfigService.config.prefix) && message.channel.parent.name == `${client.ConfigService.config.channel.categoryName}` && client.isAdmin(message.author, message, false)) {
    //create commands here
    switch (
      message.content
        .split(" ")[0]
        .replace(`${client.ConfigService.config.prefix}`, " ")
        .trim()
    ) {
      case "close":
        let member = message.guild.members.get(message.channel.name);
        member.send({
          embed: {
            color: 3447003,
            description: "Your ticket was closed by an administrator. If you need help again, send a message here!"
          }
        });
        let closeReason = message.content.slice(6) || "No reason";
        client.log("Ticket Closed", `<@${message.channel.name}>'s  support ticket was closed for reason \`\`\`${closeReason}\`\`\``, 3447003, message, client);
        message.channel.delete();
        return;
        break;
      default:
        return message.react("❌");
    }
  }

  // send message from modmail guild channel(s) to the user DM
  if (message.channel.type == "text" && !message.author.bot && !message.content.startsWith(client.ConfigService.config.prefix) && message.channel.parent.name == `${client.ConfigService.config.channel.categoryName}`) {
    let member = message.guild.members.get(message.channel.name);
    if (message.attachments.size > 0) {
      member.send(msgTemplate + " " + message.attachments.first().url);
    } else {
      if (guild.member(message.channel.name)) {
        member.send(msgTemplate);
      } else {
        client.log("Invalid ModMail Channel", `Could not find user ID \`${message.channel.name}\` in guild.`, 16711747, message, client);
        message.channel.delete();
      }
    }
  }

  // send message from user DM to modmail guild channel(s)
  if (message.channel.type == "dm" && !message.author.bot) {
    //modmail category to house the operation
    let category = guild.channels.find(c => c.name == `${client.ConfigService.config.channel.categoryName}` && c.type == "category");
    //if the category does not exist. make it!
    if (!category) {
      guild.createChannel(`${client.ConfigService.config.channel.categoryName}`, {
        type: "category",
        /*
        @TODO
        - FIX PERMS
        */
        permissionOverwrites: [
          {
            id: guild.id,
            deny: ["READ_MESSAGES"]
          },
          {
            id: admin.id,
            allow: ["READ_MESSAGES"]
          }
        ]
      });
    }
    //if the user does not have an open "ticket" (channel created) then make a new "ticket" (channel)
    if (!guild.channels.exists(ch => ch.name == message.author.id)) {
      guild.createChannel(`${message.author.id}`, "text").then(async channel => {
        let category = guild.channels.find(c => c.name == `${client.ConfigService.config.channel.categoryName}` && c.type == "category");
        await channel.setParent(category.id);
        await channel.lockPermissions();
        await channel.send("ateveryone\n" + msgTemplate);
        await message.author.send({
          embed: {
            color: 3447003,
            description: "Created new help ticket and sent your message to the admins! To send more messages and to chat with the administrators, just text me here! Any message that the admins see will be reacted with a ✅"
          }
        });
        await message.react("✅");
      });
      client.log("Ticket Created", `${message.author} created a new support ticket with first message as: \`\`\`${message.content}\`\`\`\n[Jump to Message](${message.url})`, 3447003, message, client);
    } else {
      //if they got a "ticket" already send all their messages!
      let modChannel = guild.channels.find(c => c.name == message.author.id && c.type == "text");
      if (message.attachments.size > 0) {
        modChannel.send(msgTemplate + " " + message.attachments.first().url).then(msg => {
          message.react("✅");
        });
      } else {
        modChannel.send(msgTemplate).then(msg => {
          message.react("✅");
        });
      }
    }
  }

  if (message.content.startsWith(`<@${client.user.id}> help`)) {
    let helpFile = require("./commands/help.js");
    return helpFile.run(client, message);
  }
  if (message.content.startsWith(`<@${client.user.id}> prefix`)) {
    let helpFile = require("./commands/help.js");
    return helpFile.run(client, message);
  }
  if (message.content.startsWith(`<@${client.user.id}>`)) {
    let helpFile = require("./commands/help.js");
    return helpFile.run(client, message);
  }

  // Command file manager code
  if (!message.guild || message.author.bot) return;
  if (!message.content.includes(ConfigService.config.prefix)) return;
  let command = message.content.split(" ")[0];
  command = command.slice(config.prefix.length);
  client.config = config;
  let args = message.content.split(" ").slice(1);

  // Regular command file manager
  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
    message.channel.stopTyping(true);
  } catch (err) {
    if (config.debug) {
      console.error(err);
    }
  }

  // Custom command file manager
  try {
    let commandFile = require(`./commands/cc/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    if (config.debug) {
      console.error(err);
    } else {
      return;
    }
  }
});
