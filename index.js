const { Client, Intents, Permissions, Collection } = require("discord.js");
const Sequelize = require("sequelize");
const db = require("easy-json-database");
const fs = require("fs");
const consola = require("consola");
require("dotenv").config();

const theIntents = new Intents([Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]);

const client = new Client({ intents: theIntents, partials: ["CHANNEL"] });

client.settings = new db("./settings.json");

client.commands = new Collection();
const cmds = fs.readdirSync("./commands/").filter((f) => f.endsWith(".js"));

for (const file of cmds) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const sequelize = new Sequelize("database", process.env.DB_USER, process.env.DB_PASSWORD, {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const Tickets = sequelize.define("tickets", {
  member: {
    type: Sequelize.STRING,
    unique: true,
  },
  tag: Sequelize.TEXT,
  status: Sequelize.TEXT,
  assignee: Sequelize.TEXT,
  hudID: Sequelize.TEXT,
  staffReplied: Sequelize.BOOLEAN,
});

//Message formatting templates
const messageTemplate = (message) => [{ author: { name: message.author.username, icon_url: message.author.avatarURL() }, color: "BLURPLE", description: message.content }];
const hudTemplate = (user, status, assignee, staffReplied, ticketChannel) => [
  {
    author: { name: user.tag, icon_url: user.avatarURL() },
    description: `**[Open Ticket](https://discord.com/channels/${ticketChannel.guild.id}/${ticketChannel.id})**`,
    fields: [
      { name: "Status", value: `${status}` },
      { name: "Assignee", value: `${assignee} \`${assignee.tag || "-"}\`` },
      { name: "Last Reply", value: `${staffReplied ? "STAFF" : "USER"}` },
    ],
    color: staffReplied ? 4886754 : 16098851,
  },
];
const noteTemplate = (message) => [{ title: "New Note", author: { name: message.member.nickname || message.author.username, icon_url: message.author.avatarURL() }, color: "RED", description: message.content.substring(1) }];
const topicTemplate = (user, assignee, daysOld) => `Ticket for: ${user.tag} **||** Assigned to: ${assignee} **||** Opened: ${daysOld}`;

//Generate permissionOverwrite Array. Returns type Array
function categoryPerms(guild) {
  let final = [{ id: guild.id, deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_CHANNELS] }];
  let readRoles = client.settings.get("readAccess");
  let writeRoles = client.settings.get("writeAccess");

  //Read access
  if (readRoles.length != 0) {
    readRoles.forEach((id) => {
      final.push({ id: guild.roles.cache.get(id), allow: [Permissions.FLAGS.VIEW_CHANNEL] });
    });
  }

  //Write roles
  if (readRoles.length != 0) {
    writeRoles.forEach((id) => {
      final.push({ id: guild.roles.cache.get(id), allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_CHANNELS] });
    });
  }
  return final;
}

//Logs a message to file
function log(message, user) {
  let timestamp = Date.now();

  fs.appendFile(`./logs/${user.id}.log`, `[${timestamp}] @${user.tag}: ${message}\n`, (err) => {
    if (err) {
      consola.error(err);
      return;
    }
  });
}

//Log messages to a Discord channel in either the primary or secondary guild
async function logChannel(title, event, person) {
  let guild = client.guilds.cache.get(client.settings.get("logToStaff") ? client.settings.get("staffGuild").logChannel : client.settings.get("primaryGuild").id);
  let embed = { title: title, description: event, fields: [] };
  if (person) embed.fields.push({ name: "Instantiated By", value: person });
  await guild.channels.cache.get(client.settings.get("logToStaff") ? client.settings.get("staffGuild").logChannel : client.settings.get("primaryGuild").logChannel).send({ embeds: [embed] });
}

//This function runs whenever a new ticket is created
async function createTicket(user) {
  let guild = client.guilds.cache.get(client.settings.get("primaryGuild").id);
  let sGuild = client.guilds.cache.get(client.settings.get("staffGuild").id);
  let hudChannel = sGuild.channels.cache.get(client.settings.get("staffGuild").hudChannel);
  fs.writeFile(`./logs/${user.id}.log`, `===${user.tag}'s Ticket===\n`, (err) => {
    if (err) consola.error(err);
    return;
  });
  let ticketChannel = await guild.channels.create(`${user.tag.replace(/ /g, "-")}`, { reason: "Modmail ticket created" });
  ticketChannel.setParent(client.settings.get("primaryGuild").categoryID, { lockPermissions: true });
  let msg = await hudChannel.send({ embeds: hudTemplate(user, "OPEN", "N/A", false, ticketChannel) });
  const ticket = await Tickets.create({ member: user.id, tag: ticketChannel.id, status: "OPEN", assignee: "N/A", hudID: msg.id, staffReplied: false });
  ticketChannel.setTopic(`**\|\|** Ticket Creator: ${user} (\`${user.id}\`) **\|\|** Created At: ${Date.now().toString()} **\|\|**`);
  require("./preview.js").preview(user, ticketChannel);
  await user.send({ embeds: [{ author: { name: guild.name, icon_url: guild.iconURL() }, description: client.settings.get("messages").ticketCreated }] });
  return { ticketChannel, ticket };
}

function updateHudMessage(ticket, user, status, assignee, staffReplied, ticketChannel) {
  let sGuild = client.guilds.cache.get(client.settings.get("staffGuild").id);
  let hudChannel = sGuild.channels.cache.get(client.settings.get("staffGuild").hudChannel);

  hudChannel.messages.fetch(ticket.get("hudID")).then((m) => {
    if (m) m.edit({ embeds: hudTemplate(user, status, assignee, staffReplied, ticketChannel) });
  });
}

client.on("ready", async () => {
  Tickets.sync();
  consola.info("ModMail is active and listening for direct messages.");
  consola.info(`Bot: ${client.user.tag}`);
  consola.info(`Servers: ${client.guilds.cache.size}`);
  client.user.setPresence({ activities: [{ type: 3, name: "for direct messages." }] });

  if (!client.settings.has("primaryGuild")) {
    consola.error("No primary guild found");
    process.exit(1);
  }

  //Check if category exists and make if it doesn't
  client.guilds.fetch();
  let guild = client.guilds.cache.get(client.settings.get("primaryGuild").id);
  if (guild.available) {
    guild.channels.fetch(client.settings.get("primaryGuild").categoryID).catch((e) => {
      consola.warn("Unable to find category channel. Attempting to create a new category.");
      guild.channels.create("ModMail Tickets", { type: "GUILD_CATEGORY", permissionOverwrites: categoryPerms(guild) }).then((t) => {
        let pG = client.settings.get("primaryGuild");
        pG.categoryID = t.id;
        client.settings.set("primaryGuild", pG);
        consola.success(`Created a category: ${t.name}!`);
      });
    });
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.partial) message.fetch();

  // if (message.mentions.has(client.user) && message.channel.type != "DM") message.reply("Hello, I'm ModMail! DM me for assistance.");

  const args = message.content.slice(client.settings.get("prefix").length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  function helpText(cmd, args) {
    if (args.length == 0) return;
    let b = "";
    for (a in args) {
      b += `[${args[a]}] `;
    }
    message.channel.send(`\`\`\`\nInvalid command usage.\n\n${client.settings.get("prefix")}${cmd} ${b.trim()}\`\`\``);
  }

  if (client.commands.has(command) && message.channel.type !== "DM") {
    try {
      let c = client.commands.get(command);
      switch (c.perm) {
        case 0:
          let cmd = await c.execute(client, message, args);
          if (cmd == false) helpText(c.name, c.args);
          break;
        case 1:
          if (message.member.roles.cache.some((role) => client.settings.get("writeAccess").includes(role.id))) {
            let cmd = await c.execute(client, message, args, Tickets);
            if (cmd == false) helpText(c.name, c.args);
          }
          break;
        default:
          break;
      }
    } catch (e) {
      consola.error(e);
    }
  }
  if (message.channel.type === "GUILD_TEXT" && message.channel.parentId == client.settings.get("primaryGuild").categoryID) {
    //Server -> DM
    if (message.content.startsWith("#")) {
      message.channel.send({ embeds: noteTemplate(message) });
      message.delete();
      return log("New Note: " + message.content.substring(1).trim(), message.author);
    }

    //Detect and run Modmail commands
    if (message.content.startsWith(client.settings.get("prefix"))) {
      const mArgs = message.content.slice(client.settings.get("prefix").length).trim().split(/ +/g);
      const mCommand = mArgs.shift().toLowerCase();
      client.emit("mmCommand", mCommand, mArgs, message);
      return;
    }

    let thisTicket = await Tickets.findOne({ where: { tag: message.channel.id } });
    let receiver = await client.users.fetch(thisTicket.get("member")).catch(() => consola.error(`Could not fetch user for ticket ${message.channel.name}`)); //User object of receive
    if (!receiver) return logChannel("User Not Found", `Could not find user \`${memberID}\``);

    receiver.send({ embeds: messageTemplate(message) }).then(() => {
      if (message.attachments.size == 0) {
        message.react("✅");
      }
    });

    if (message.attachments.size > 0) {
      let ImageArray = [];
      message.attachments.forEach((attachment) => {
        ImageArray.push(attachment.url);
        log(attachment.url, message.author);
      });
      receiver
        .send({ files: ImageArray })
        .then(() => {
          message.react("✅");
        })
        .catch();
    }

    if (!thisTicket.get("staffReplied")) {
      await Tickets.update({ staffReplied: true }, { where: { member: receiver.id } });
      updateHudMessage(thisTicket, receiver, thisTicket.get("status"), thisTicket.get("assignee"), true, message.channel);
    }
  }

  //Send DMS -> Server
  if (message.channel.type === "DM" && !message.content.startsWith(client.settings.get("prefix"))) {
    //Check if the user is allowed to use ModMail
    if (client.settings.get("blockedUsers").includes(message.author.id)) {
      return message.author.send({ embeds: [{ author: { name: message.guild.name, icon_url: message.guild.iconURL() }, description: client.settings.get("messages").blocked }] });
    } else if (client.settings.get("lock")) {
      return message.author.send({ embeds: [{ author: { name: message.guild.name, icon_url: message.guild.iconURL() }, description: client.settings.get("messages").locked }] });
    } //End of perm checking

    //Check if ticket exists
    let ticket = await Tickets.findOne({ where: { member: message.author.id } });
    if (!ticket) {
      let newTicket = await createTicket(message.author);
      logChannel("Ticket Created", `${message.author.tag} created a new ticket.\n\nInitial Content:\`\`\`${message.content}\`\`\``);
    }
    let guild = client.guilds.cache.get(client.settings.get("primaryGuild").id); //Ticket operating guild
    let existingTicket = await Tickets.findOne({ where: { member: message.author.id } }); //Get the updated ticket data

    //For all incoming messages
    let channel = await guild.channels.fetch(existingTicket.get("tag")).catch((e) => consola.error(`Could not find channel ${existingTicket.get("tag")}`));
    if (!channel) return;
    channel.send({ embeds: messageTemplate(message) }).then(() => {
      if (message.attachments.size == 0) {
        log(message.content, message.author);
        message.react("✅");
      }
    });
    if (message.attachments.size > 0) {
      let ImageArray = [];
      message.attachments.forEach((attachment) => {
        ImageArray.push(attachment.url);
        log(attachment.url, message.author);
      });
      channel
        .send({ files: ImageArray })
        .then(() => {
          message.react("✅");
        })
        .catch();
    }

    if (existingTicket.get("staffReplied")) {
      await Tickets.update({ staffReplied: false }, { where: { member: message.author.id } });
      updateHudMessage(existingTicket, message.author, existingTicket.get("status"), existingTicket.get("assignee"), false, channel);
    }
  } else if (message.content.startsWith(client.settings.get("prefix")) && message.channel.type === "DM" && client.commands.has(command)) {
    message.reply("*Commands do not work in DMs!* Please use the server to run commands. To start a new ticket or reply to an already existing ticket simply send a message in this channel!");
  }
});

//ModMail ticket channel command handler
client.on("mmCommand", async (command, args, message) => {
  let thisTicket = await Tickets.findOne({ where: { tag: message.channel.id } });
  let receiver = await client.users.fetch(thisTicket.get("member")).catch(() => consola.error(`Could not fetch user for ticket ${message.channel.name}`)); //User object of receive

  if (!receiver || !thisTicket) return consola.error("Could not find this ticket");

  switch (command) {
    case "close":
      log(`[SYSTEM] Closing Ticket Reason: ${args.join(" ")}`, message.author);
      message.channel.delete();
      receiver.send({ embeds: [{ author: { name: message.guild.name, icon_url: message.guild.iconURL() }, description: client.settings.get("messages").ticketClosed }] });
      break;
    case "note":
      message.content = "#" + args.join(" ");
      message.channel.send({ embeds: noteTemplate(message) });
      log("[SYSTEM] New Note: " + args.join(" "), message.author);
      message.delete();
      break;
    case "undo":
      break;
    case "status":
      if (args.length == 0) {
        message.channel.send({ embeds: [{ title: `Current Status: ${thisTicket.get("status")}`, color: "AQUA" }] });
      } else {
        updateHudMessage(thisTicket, receiver, args.join(" ").trim(), thisTicket.get("assignee"), thisTicket.get("staffReplied"), message.channel);

        await Tickets.update({ status: args.join(" ").trim() }, { where: { member: receiver.id } });

        message.channel.send({ embeds: [{ title: `Updated Status: ${args.join(" ").trim()}`, color: "AQUA" }] });
        log(`[SYSTEM] Updated Status: ${args.join(" ")}`, message.author);
      }
      break;
    case "data":
      message.channel.send(`\`\`\`json\n${JSON.stringify(thisTicket.toJSON(), null, 2)}\`\`\``);
      break;
    case "assign":
      if (message.mentions.members.size != 1 || message.mentions.members.first().user.bot) {
        message.react("❌");
        return setTimeout(() => message.delete().catch(), 3000);
      }

      message.channel.send({ embeds: [{ title: `New Assignee: ${message.mentions.members.first().user.tag}` }] });

      await Tickets.update({ assignee: message.mentions.members.first().user.id }, { where: { member: receiver.id } });

      try {
        message.mentions.members.first().send({
          embeds: [
            {
              title: "You were assigned a ticket",
              description: `**[View Ticket](https://discord.com/channels/${message.guild.id}/${message.channel.id})**`,
              color: "DARK_RED",
              fields: [
                { name: "User", value: `${receiver} (${receiver.tag}) \`${receiver.id}\`` },
                { name: "Status", value: thisTicket.get("status") },
              ],
            },
          ],
        });
      } catch (e) {
        return;
      }

      updateHudMessage(thisTicket, receiver, thisTicket.get("status"), message.mentions.members.first().user, thisTicket.get("staffReplied"), message.channel);

      log(`[SYSTEM] New Assignee: ${message.mentions.members.first().user.tag} (${message.mentions.members.first().user.id})`, message.author);
      break;
    default:
      message.react("❌");
      setTimeout(() => message.delete().catch(), 3000);
  }
});

//Modmail closing ticket handler
client.on("channelDelete", async (channel) => {
  if (channel.guild.id == client.settings.get("primaryGuild").id && channel.type === "GUILD_TEXT" && channel.parentId == client.settings.get("primaryGuild").categoryID) {
    let thisTicket = await Tickets.findOne({ where: { tag: channel.id } });
    let receiver = await client.users.fetch(thisTicket.get("member")).catch(() => consola.error(`Could not fetch user for ticket ${channel.name}`)); //User object of receive
    let guild = client.guilds.cache.get(client.settings.get("logToStaff") ? client.settings.get("staffGuild").logChannel : client.settings.get("primaryGuild").id);
    let sGuild = client.guilds.cache.get(client.settings.get("staffGuild").id);

    let hudChannel = sGuild.channels.cache.get(client.settings.get("staffGuild").hudChannel);

    hudChannel.messages.fetch(thisTicket.get("hudID")).then((m) => {
      m.delete();
    });

    await guild.channels.cache.get(client.settings.get("logToStaff") ? client.settings.get("staffGuild").logChannel : client.settings.get("primaryGuild").logChannel).send({ embeds: [{ title: "Ticket Closed", description: `**${channel.name}** ticket closed.` }], files: [{ attachment: `./logs/${receiver.id}.log`, name: `${channel.name}-${Date.now()}.log`, description: "Modmail Ticket Log" }] });
    await Tickets.destroy({ where: { member: receiver.id } });
    try {
      fs.unlinkSync(`./logs/${receiver.id}.log`, (err) => {
        if (err) return consola.error(`Unable to delete log file for ${channel.name}`);
      });
    } catch (e) {
      consola.error(`Unable to delete log file for ${channel.name}`);
    }
  }
});

client.login(process.env.TOKEN).catch((e) => {
  consola.error("Could not login with this token. Please make sure the correct token is in your .env file");
  process.exit(1);
});
