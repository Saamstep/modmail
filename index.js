"use strict";
//define important bot things
const { Intents } = require("discord.js");
const Commando = require("discord.js-commando");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");

const intents = new Intents([Intents.NON_PRIVILEGED, "GUILD_MEMBERS"]);

//create the bot boi
const client = new Commando.CommandoClient({
  commandPrefix: `${require("./config.json").prefix}`,
  owner: `${require("./config.json").ownerid}`,
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  ws: { intents },
});

try {
  require("./config.json");
} catch (e) {
  return require(path.join(__dirname, "functions/console.js")).error("CONFIG", "There seems to be an error with your configuration file. This is most likely a simple JSON syntax error. Please see the docs for details.\nDetailed error: " + e);
}
//hey look its a config file poggers
client.config = require("./config.json");
//this must match what is in the config.json
const CONFIG_VERSION = 1;
/*
==========================================================================================
   _____ ____  __  __ __  __          _   _ _____   _____ 
  / ____/ __ \|  \/  |  \/  |   /\   | \ | |  __ \ / ____|
 | |   | |  | | \  / | \  / |  /  \  |  \| | |  | | (___  
 | |   | |  | | |\/| | |\/| | / /\ \ | . ` | |  | |\___ \ 
 | |___| |__| | |  | | |  | |/ ____ \| |\  | |__| |____) |
  \_____\____/|_|  |_|_|  |_/_/    \_\_| \_|_____/|_____/ 
 ==========================================================================================                                    
  */
client.registry
  .registerDefaultTypes()
  .registerGroups([
    ["utility", "Utility"],
    ["mods", "Mods"],
    ["admins", "Admins"],
    ["settings", "Settings"],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    unknownCommand: false,
    prefix: false,
  })
  .registerCommandsIn(path.join(__dirname, "commands"));

/*
==========================================================================================
  _____  ______ _____  __  __ _____  _____ _____ _____ ____  _   _  _____ 
 |  __ \|  ____|  __ \|  \/  |_   _|/ ____/ ____|_   _/ __ \| \ | |/ ____|
 | |__) | |__  | |__) | \  / | | | | (___| (___   | || |  | |  \| | (___  
 |  ___/|  __| |  _  /| |\/| | | |  \___ \\___ \  | || |  | | . ` |\___ \ 
 | |    | |____| | \ \| |  | |_| |_ ____) |___) |_| || |__| | |\  |____) |
 |_|    |______|_|  \_\_|  |_|_____|_____/_____/|_____\____/|_| \_|_____/ 
 ==========================================================================================                                    
  */
client.dispatcher.addInhibitor((msg) => {
  if (msg.channel.type == "dm") return false;
  let admin = msg.guild.roles.cache.find((r) => r.id == client.config.role.admin || r.name == client.config.role.admin);
  let mod = msg.guild.roles.cache.find((a) => a.id == client.config.role.admin || a.name == client.config.role.mod);
  switch (msg.command.group.name) {
    case "Admins":
      if (msg.member.roles.cache.has(admin.id) || client.config.ownerid == msg.member.user.id) {
        return false;
      } else {
        client.error("Invalid permissions, you must be an Admin!", msg);
        return "Invalid permissions";
      }
      break;
    case "Mods":
      if (msg.member.roles.cache.has(mod.id) || msg.member.roles.cache.has(admin.id) || client.config.ownerid == msg.member.user.id) {
        return false;
      } else {
        client.error("Invalid permissions, you must be a Mod!", msg);
        return "Invalid permissions";
      }
      break;
    case "Settings":
      if (msg.member.roles.cache.has(admin.id) || client.config.ownerid == msg.member.user.id) {
        return false;
      } else {
        client.error("Invalid permissions, you must be an Admin!", msg);
        return "Invalid permissions";
      }
      break;
    default:
      return false;
  }
});

client.dispatcher.addInhibitor((msg) => {
  if (!msg.channel.parent) return;
  if (msg.channel.parent.name == client.config.modmail.category) {
    msg.channel.send({ embed: { description: "Modmail Bot commands do not work very well in ModMail ticket channels! Please use another channel for smoother operation! (Users do not see bot output)", color: 13632027 } }).then((m) => m.delete({ timeout: 10000 }));
  }
});
/*
=============================================================================================================
 _    _ ______ _      _____  ______ _____     ______ _    _ _   _  _____ _______ _____ ____  _   _  _____ 
 | |  | |  ____| |    |  __ \|  ____|  __ \   |  ____| |  | | \ | |/ ____|__   __|_   _/ __ \| \ | |/ ____|
 | |__| | |__  | |    | |__) | |__  | |__) |  | |__  | |  | |  \| | |       | |    | || |  | |  \| | (___  
 |  __  |  __| | |    |  ___/|  __| |  _  /   |  __| | |  | | . ` | |       | |    | || |  | | . ` |\___ \ 
 | |  | | |____| |____| |    | |____| | \ \   | |    | |__| | |\  | |____   | |   _| || |__| | |\  |____) |
 |_|  |_|______|______|_|    |______|_|  \_\  |_|     \____/|_| \_|\_____|  |_|  |_____\____/|_| \_|_____/ 
 ============================================================================================================
  */
function sendMessage(client, channel, content) {
  client.guilds.cache.map((g) => {
    try {
      g.channels.cache.find((ch) => ch.id == channel || ch.name == channel).send(content);
    } catch (e) {
      return;
    }
  });
}
client.once("ready", () => {
  /*
==========================================================================================
           _____ _____ ______  _____ _____  __      __     _____   _____ 
     /\   / ____/ ____|  ____|/ ____/ ____| \ \    / /\   |  __ \ / ____|
    /  \ | |   | |    | |__  | (___| (___    \ \  / /  \  | |__) | (___  
   / /\ \| |   | |    |  __|  \___ \\___ \    \ \/ / /\ \ |  _  / \___ \ 
  / ____ \ |___| |____| |____ ____) |___) |    \  / ____ \| | \ \ ____) |
 /_/    \_\_____\_____|______|_____/_____/      \/_/    \_\_|  \_\_____/ 
 ==========================================================================================                                    
  */
  client.rolePerm = require("./functions/roleperm.js");
  client.error = require("./functions/error.js");
  client.log = require("./functions/log.js");
  client.cn = require("./functions/console.js");
  /*
==========================================================================================
  _      ____   ____  _____   _____ 
 | |    / __ \ / __ \|  __ \ / ____|
 | |   | |  | | |  | | |__) | (___  
 | |   | |  | | |  | |  ___/ \___ \ 
 | |___| |__| | |__| | |     ____) |
 |______\____/ \____/|_|    |_____/ 
 ==========================================================================================                                    
  */
  fs.readdir(path.join(__dirname, "modules/loop"), (err, files) => {
    client.cn.log("Loop", `Found ${chalk.underline(Object.keys(client.config.loops).length)} loops`);
    if (err) return console.error(err);
    files.forEach((file) => {
      if (!file.includes("js")) return;
      let eventFunction = require(path.join(__dirname, `modules/loop/${file}`));
      let eventName = file.split(".")[0];
      if (client.config.loops[eventName]) {
        eventFunction.run(client);
        setInterval(() => {
          eventFunction.run(client);
        }, eventFunction.time);
        client.cn.log("Loop", `Started ${chalk.underline(eventName)} loop`);
      } else {
        // client.cn.log("Loop", `Stopped ${chalk.underline(eventName)}`);
      }
    });
  });
  /*
==========================================================================================
   _____ ______ _______      _______ _____ ______  _____ 
  / ____|  ____|  __ \ \    / /_   _/ ____|  ____|/ ____|
 | (___ | |__  | |__) \ \  / /  | || |    | |__  | (___  
  \___ \|  __| |  _  / \ \/ /   | || |    |  __|  \___ \ 
  ____) | |____| | \ \  \  /   _| || |____| |____ ____) |
 |_____/|______|_|  \_\  \/   |_____\_____|______|_____/ 
==========================================================================================                                    
  */
  fs.readdir(path.join(__dirname, "modules/service"), (err, files) => {
    client.cn.log("Services", `Found ${chalk.underline(Object.keys(client.config.services).length)} services`);
    if (err) return console.log(err);
    files.forEach((file) => {
      if (!file.includes("js")) return;
      let eventFunction = require(path.join(__dirname, `modules/service/${file}`));
      let eventName = file.split(".")[0];
      if (client.config.services[eventName]) {
        eventFunction.run(client, sendMessage);
        client.cn.log("Service", `Started ${chalk.underline(eventName)} service`);
      } else {
        // client.cn.log("Service", `Disabled ${chalk.underline(eventName)}`);
      }
    });
  });

  /*
==========================================================================================
   _____ _    _ ______ _____ _  ________ _____  
  / ____| |  | |  ____/ ____| |/ /  ____|  __ \ 
 | |    | |__| | |__ | |    | ' /| |__  | |__) |
 | |    |  __  |  __|| |    |  < |  __| |  _  / 
 | |____| |  | | |___| |____| . \| |____| | \ \ 
  \_____|_|  |_|______\_____|_|\_\______|_|  \_\                              
==========================================================================================                                    
  */
  if (client.config.version != CONFIG_VERSION) {
    throw new Error(chalk.red.bold(`Incompatible config file version ${client.config.version} for this bot version ${require("./package.json").version}. Must use config version ${CONFIG_VERSION}`));
  }

  // Role and Channel Checker
  client.guilds.cache.map((guild) => {
    const cn = require("./functions/console.js");
    //Role checker
    Object.keys(client.config.role).forEach(function (role) {
      if (client.config.role[role] == "") return cn.error("Warn (Roles Config)", `Permission role for ${role} is not defined in the config!`);
      if (guild.roles.cache.find((r) => r.id == client.config.role[role] || r.name == client.config.role[role]) == undefined) {
        cn.error("Warn (Roles Config)", `Permission role for ${role} defined as ${client.config.role[role]} was not found in guild: ${guild.name}`);
      }
    });

    //Channel Checker
    Object.keys(client.config.channel).forEach(function (channel) {
      if (client.config.channel[channel] == "") return cn.error("Warn (Channels Config)", `Channel for ${channel} is not defined in the config!`);
      if (guild.channels.cache.find((ch) => ch.id == client.config.channel[channel] || ch.name == client.config.channel[channel]) == undefined) {
        cn.error("Warn (Channels Config)", `Channel for ${channel} defined as ${client.config.channel[channel]} was not found in guild: ${guild.name}`);
      }
    });
  });
});

fs.access("./logs", (err) => {
  const cn = require("./functions/console.js");
  if (!err) {
    cn.log("Logs", "Your logs folder is ready");
  } else {
    fs.mkdir("./logs", function (err) {
      if (err) return client.cn.log("Logs", err);
      cn.log("Logs", "Your logs folder is now ready");
    });
  }
});
/*
==========================================================================================
  ______ _____  _____   ____  _____   _____ 
 |  ____|  __ \|  __ \ / __ \|  __ \ / ____|
 | |__  | |__) | |__) | |  | | |__) | (___  
 |  __| |  _  /|  _  /| |  | |  _  / \___ \ 
 | |____| | \ \| | \ \| |__| | | \ \ ____) |
 |______|_|  \_\_|  \_\\____/|_|  \_\_____/ 
==========================================================================================                                    
  */
client.on("error", (error) => {
  if (error == "TypeError: Cannot read property 'group' of null") return;
  return client.cn.error("Client", error);
});

/*
==========================================================================================
  __  __  ____  _____  __  __          _____ _      
 |  \/  |/ __ \|  __ \|  \/  |   /\   |_   _| |     
 | \  / | |  | | |  | | \  / |  /  \    | | | |     
 | |\/| | |  | | |  | | |\/| | / /\ \   | | | |     
 | |  | | |__| | |__| | |  | |/ ____ \ _| |_| |____ 
 |_|  |_|\____/|_____/|_|  |_/_/    \_\_____|______|
==========================================================================================                                    
  */
const guild = client.guilds.cache.get(client.config.modmail.guild);
function logMail(user, message) {
  let LOG_TEMPLATE = `[${new Date()}] [${message.author.username}] ${message.content} ${message.attachments.first() ? message.attachments.first().url : ""}\n`;
  if (message.content.startsWith(`${client.config.prefix}snippet`)) LOG_TEMPLATE = `[${new Date()}] [${message.author.username}] Snippet (#${message.content.split(" ")[1]}): ${client.config.snippets[parseInt(message.content.split(" ")[1])]}\n`;
  fs.appendFileSync(`./logs/${user.id}.txt`, LOG_TEMPLATE);
}

//parse users tag and convert it to a channelName
function getChannelName(user) {
  let value = user.replace("#", "-").toLowerCase();
  value = value.replace(/ /g, "-");
  return value;
}

function msg(destination, g, message, embed) {
  switch (destination) {
    case "guild":
      g.channels.cache
        .find((ch) => ch.name == `${getChannelName(message.author.tag)}`)
        .send({ embed })
        .then(() => message.react("✅"))
        .catch((error) => message.react("❌"));
      break;
    case "dm":
      user.send({ embed });
      break;
  }
}

// check if guild modmail category exists
function hasCategory(g) {
  if (g.channels.cache.find((ch) => ch.id == client.config.modmail.category || ch.name == client.config.modmail.category)) {
    return true;
  } else {
    return false;
  }
}

//makes a ticket channel, sends the confirmation that a ticket was created and starts the logger
function makeTicket(g, message, embed) {
  let category = g.channels.cache.find((ch) => ch.id == client.config.modmail.category || ch.name == client.config.modmail.category);
  g.channels.create(getChannelName(message.author.tag), { reason: "New ModMail ticket", topic: `[${message.author.id}] ${client.config.messages.ticketDesc.replace("[p]", client.config.prefix)}`, parent: category }).then((ch) => ch.send({ embed }));
  logMail(message.author, message);
  message.author
    .send({ embed: { description: client.config.messages.newTicket } })
    .then(() => message.react("✅"))
    .catch((error) => message.react("❌"));
  // client.log("New Ticket", `Initial content: \`\`\`${message.content}\`\`\``, 440298, message);
  g.channels.cache
    .find((ch) => ch.name == client.config.channel.log || ch.id == client.config.channel.log)
    .send({
      embed: {
        description: `Initial Content: \`\`\`${message.content}\`\`\``,
        color: 440298,
        timestamp: Date.now(),
        footer: {
          icon_url: `${client.user.avatarURL()}`,
          text: `${client.user.username} - Logs`,
        },
        author: {
          name: "New Ticket",
          icon_url: "https://samstep.net/bots/assets/log.png",
        },
        fields: [
          {
            name: "Ran By",
            value: `${message.author}`,
          },
        ],
      },
    });
}

//checks if a ticket is already open
function hasTicket(g, message) {
  let channelName = getChannelName(message.author.tag);
  let ticket = g.channels.cache.find((ch) => ch.name == channelName);
  if (ticket) {
    return true;
  } else {
    return false;
  }
}

function modmailCommands() {
  const commands = [
    { cmd: "close", desc: "Close a ticket channel" },
    { cmd: "cmds", desc: "This command! Shows you useful things :)" },
    { cmd: "snippet", desc: "Open the snippet menu and choose a snippet to send" },
    { cmd: "block", desc: "Block this user" },
    { cmd: "lock", desc: "Disable all modmail messages" },
  ];
  let str = "```\n";
  for (let i in commands) {
    str += `${client.config.prefix}${commands[i].cmd} - ${commands[i].desc}\n`;
  }
  return str + "\n```";
}

async function configArrayPush(property, value) {
  let data = client.config;
  await data.modmail[property].push(value);
  fs.writeFile("./config.json", JSON.stringify(data, null, 3), (err) => {
    if (err) return client.cn.error("Config", err);
    client.cn.log("Config", `The config file has been saved! Added to property ${property} new value ${value}`);
  });
  client.config = await require("./config.json");
}

async function configArrayRemove(property, value) {
  let data = client.config;
  data.modmail[property] = await data.modmail[property].filter(function (val, index, arr) {
    return val !== value;
  });
  fs.writeFile("./config.json", JSON.stringify(data, null, 3), (err) => {
    if (err) return client.cn.error("Config", err);
    client.cn.log("Config", `The config file has been saved! Removed in property ${property} removed value ${value}`);
  });
  client.config = await require("./config.json");
}

async function updateConfigProp(property, value) {
  let data = client.config;
  data.modmail[property] = value;
  fs.writeFile("./config.json", JSON.stringify(data, null, 3), (err) => {
    if (err) return client.cn.error("Config", err);
    client.cn.log("Config", `The config file has been saved! Updated property ${property} to value ${value}`);
  });
  client.config = await require("./config.json");
}

function getSnippets() {
  let d = "";
  client.config.snippets.forEach((snip) => {
    if (snip.length > 20) {
      d += `[${client.config.snippets.indexOf(snip)}] ` + snip.substring(0, 20).concat(" (cont.)\n");
    } else {
      d += `[${client.config.snippets.indexOf(snip)}] ${snip}` + "\n";
    }
  });
  if (client.config.snippets.length == 0) d = `No snippets loaded! Make some with ${client.config.prefix}snippets create <Text to add>.`;
  return `\`\`\`\n${d}\`\`\``;
}

let reason = "";
client.on("message", async (message) => {
  //guild active in (one guild only right now)
  const guild = client.guilds.cache.get(client.config.modmail.guild);
  // template message sender
  let embed = {
    author: {
      name: message.author.username,
      icon_url: message.author.displayAvatarURL(),
    },
    description: message.content,
    color: client.config.modmail.color,
    image: {},
  };
  if (message.attachments.first()) embed.image.url = message.attachments.first().url;

  //detect dm channel
  if (message.channel.type == "dm" && !message.author.bot) {
    //checks if the user is blocked
    if (client.config.modmail.blockedUsers.some((usr) => message.author.id == usr)) {
      return message.author.send({ embed: { description: client.config.messages.blockedUserError, color: client.config.modmail.color } });
    } else if (!client.config.modmail.enabled) {
      return message.author.send({ embed: { description: client.config.messages.disabled, color: client.config.modmail.color } });
    }

    if (message.content.startsWith(client.config.prefix)) {
      return;
    }

    if (hasCategory(guild)) {
      //check for modmail category
      //if modmail category, check for open ticket
      if (hasTicket(guild, message)) {
        //if ticket, send messages and write to logger
        msg("guild", guild, message, embed);
        logMail(message.author, message);
      } else {
        //if no ticket, make one
        makeTicket(guild, message, embed);
      }
    } else {
      //if no modmail category create one and then create the ticket and send a confirmation message
      let perms = [
        { id: guild.roles.cache.find((r) => r.name == client.config.role.mod || r.id == client.config.role.mod).id, allow: ["VIEW_CHANNEL"] },
        { id: guild.roles.cache.find((r) => r.name == client.config.role.admin || r.id == client.config.role.admin).id, allow: ["VIEW_CHANNEL"] },
        { id: guild.id, deny: ["VIEW_CHANNEL"] },
      ];
      if (client.config.modmail.rolesAllowed.length > 0) {
        client.config.modmail.rolesAllowed.forEach((role) => {
          perms.push({ id: guild.roles.cache.find((r) => r.name == role || r.id == role).id, allow: ["VIEW_CHANNEL"] });
        });
      }
      guild.channels
        .create(client.config.modmail.category, {
          type: "category",
          reason: "ModMail category needed",
          permissionOverwrites: perms,
        })
        .then((cat) => {
          guild.channels
            .create(getChannelName(message.author.tag), { reason: "New ModMail ticket", topic: `[${message.author.id}] ${client.config.messages.ticketDesc.replace("[p]", client.config.prefix)}`, parent: cat })
            .then((ch) => {
              ch.send({ embed }).then(() => message.react("✅"));
              logMail(message.author, message);
              message.author.send({ embed: { description: client.config.messages.newTicket } });
            })
            .catch((error) => message.react("❌"));
        });
      // client.log("New Ticket", `Initial content: \`\`\`${message.content}\`\`\``, 440298, message);
      guild.channels.cache
        .find((ch) => ch.name == client.config.channel.log || ch.id == client.config.channel.log)
        .send({
          embed: {
            description: `Initial Content: \`\`\`${message.content}\`\`\``,
            color: 440298,
            timestamp: Date.now(),
            footer: {
              icon_url: `${client.user.avatarURL()}`,
              text: `${client.user.username} - Logs`,
            },
            author: {
              name: "New Ticket",
              icon_url: "https://samstep.net/bots/assets/log.png",
            },
            fields: [
              {
                name: "Ran By",
                value: `${message.author}`,
              },
            ],
          },
        });
      // client.log("Category Remade", `Recreated ModMail tickets category as I could not find it.`, 440298, message);
      guild.channels.cache
        .find((ch) => ch.name == client.config.channel.log || ch.id == client.config.channel.log)
        .send({
          embed: {
            description: `Recreated ModMail tickets category as I could not find it.`,
            color: 440298,
            timestamp: Date.now(),
            footer: {
              icon_url: `${client.user.avatarURL()}`,
              text: `${client.user.username} - Logs`,
            },
            author: {
              name: "Category Remade",
              icon_url: "https://samstep.net/bots/assets/log.png",
            },
            fields: [
              {
                name: "Ran By",
                value: `${message.author}`,
              },
            ],
          },
        });
    }
  }

  //TICKET COMMANDS CONTROLLER
  if (message.channel.parentID == guild.channels.cache.find((ch) => ch.name == client.config.modmail.category || ch.id == client.config.modmail.category) && !message.author.bot && message.content.startsWith(client.config.prefix)) {
    guild.members.fetch();
    let user = guild.members.cache.find((m) => m.id == message.channel.topic.substring(1, message.channel.topic.indexOf("]")));

    switch (message.content.split(" ")[0].slice(1).toLowerCase()) {
      case "close":
        reason = message.content.split(" ").slice(1).join(" ") || null;
        message.channel.delete();
        break;
      case "snippet":
        let arg = message.content.split(" ")[1];
        if (arg == undefined) {
          return message.channel.send(`Use a valid snippet number. \`Ex: ${client.config.prefix}snippet [#]\`\n` + getSnippets());
        } else if (!client.config.snippets[parseInt(arg)]) {
          message.react("❌");
          return message.delete({ timeout: 3000 });
        } else {
          user.send({ embed: { author: { name: message.author.username, icon_url: message.author.displayAvatarURL() }, color: client.config.modmail.color, description: client.config.snippets[parseInt(arg)] } }).catch((e) => {
            return client.error("Unable to send snippet to this user.", message);
          });
          logMail(user, message);
          message.delete();
          message.channel
            .send({
              embed: { description: `Snippet Sent (#${arg}): \`\`\`${client.config.snippets[parseInt(arg)]}\`\`\``, color: client.config.modmail.color, author: { name: message.author.username, icon_url: message.author.displayAvatarURL() } },
            })
            .then((msg) => msg.react("✅"));
        }
        break;
      case "block":
        if (client.config.modmail.blockedUsers.some((usr) => usr == user.id)) {
          configArrayRemove("blockedUsers", user.id);
          message.channel.send(`${user} successfully unblocked.`);
          client.log("User Unblocked", `${user.user.username}#${user.user.discriminator} (ID: \`${user.id}\`) has been unblocked`, 82938, message);
        } else {
          configArrayPush("blockedUsers", user.id);
          message.channel.send(`${user} successfully blocked.`);
          client.log("User Blocked", `${user.user.username}#${user.user.discriminator} (ID: \`${user.id}\`) has been blocked`, 82938, message);
        }
        break;
      case "lock":
        if (client.config.modmail.enabled) {
          updateConfigProp("enabled", false);
          message.channel.send("ModMail has been locked");
          client.user.setStatus("dnd");
          client.log("ModMail Locked", `ModMail has been locked by a user in #${message.channel.name}`, 968392, message);
        } else {
          updateConfigProp("enabled", true);
          message.channel.send("ModMail has been unlocked");
          client.user.setStatus("online");
          client.log("ModMail Unlocked", `ModMail has been unlocked by a user in #${message.channel.name}`, 968392, message);
        }
        break;
      case "cmds":
        message.channel.send(modmailCommands());
        break;
      default:
        message.react("❌");
        message.delete({ timeout: 3000 });
        break;
    }
    return;
  }

  //GUILD TO DM controller
  if (!message.author.bot && message.channel.parentID == guild.channels.cache.find((ch) => ch.name == client.config.modmail.category || ch.id == client.config.modmail.category) && message.channel.type != "dm") {
    // let user = guild.members.cache.find((m) => m.user.tag.replace("#", "-").toLowerCase() == message.channel.name);
    let user = guild.members.cache.find((m) => m.id == message.channel.topic.substring(1, message.channel.topic.indexOf("]")));
    if (!user) return;
    user
      .send({ embed })
      .then(() => message.react("✅"))
      .catch((error) => message.react("❌"));
    logMail(user, message);
  }
});

//ticket closing functions
client.on("channelDelete", async (channel) => {
  const guild = client.guilds.cache.get(client.config.modmail.guild);

  // let user = guild.members.cache.find((m) => m.user.tag.replace("#", "-").toLowerCase() == channel.name);
  if (channel.type != "text" || !channel.topic || channel.topic[0] != "[") return;
  guild.members.fetch();
  let user = guild.members.cache.find((m) => m.id == channel.topic.substring(1, channel.topic.indexOf("]")));
  if (!user) return;

  await guild.channels.cache
    .find((ch) => ch.name == client.config.channel.log || ch.id == client.config.channel.log)
    .send({
      embed: {
        author: { name: "Ticked Closed", icon_url: "https://samstep.net/bots/assets/log.png" },
        description: `Ticket \`${channel.name}\` deleted by a staff member. If there are any logs find them below. ${reason ? "```Reason:" + reason + "```" : ""}`,
        color: 34490,
      },
    });
  await guild.channels.cache.find((ch) => ch.name == client.config.channel.log || ch.id == client.config.channel.log).send("", { files: [`./logs/${user.id}.txt`] });
  await fs.unlink(`./logs/${user.id}.txt`, (err) => {
    if (err) return client.cn.error("Config", err);
  });
  //if channel is modmail ticket
  if (!channel.parent) return;
  try {
  } catch (e) {
    console.error(e);
  }
});

/*
==========================================================================================
  _      ____   _____ _____ _   _ 
 | |    / __ \ / ____|_   _| \ | |
 | |   | |  | | |  __  | | |  \| |
 | |   | |  | | | |_ | | | | . ` |
 | |___| |__| | |__| |_| |_| |\  |
 |______\____/ \_____|_____|_| \_|
==========================================================================================                                    
  */
try {
  client
    .login(client.config.token)
    .then(
      function () {
        let cn = require("./functions/console.js");
        cn.log("Startup", `Logged in as ${client.user.username}#${client.user.discriminator}`);
        cn.log(`Guilds`, `| Connected to ${client.guilds.cache.size} guild${client.guilds.cache.size > 1 ? "s " : " "}`);
        if (client.guilds.cache.size > 1) cn.error("Warn", "Keep in mind that this bot is not optimized for multiple servers so use caution!");
      },
      function (err) {
        require(path.join(__dirname, "functions/console.js")).error("Login", err);
      }
    )
    .catch((err) => console.error(err));
} catch (e) {
  console.error(e);
}
