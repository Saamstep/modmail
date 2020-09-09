const { Command } = require("discord.js-commando");
const fs = require("fs");
module.exports = class openTicketCommand extends Command {
  constructor(client) {
    super(client, {
      name: "open",
      group: "mods",
      memberName: "open",
      guildOnly: true,
      description: "Open a ticket for a user",
      examples: ["open @DiscordUser#2020"],
      args: [
        { key: "user", prompt: "Please provide a user to bind to a ticket.", type: "user" },
        { key: "content", prompt: "Please type in your initial message for the ticket", type: "string" },
      ],
    });
  }

  run(message, { user, content }) {
    function logMail(user, message) {
      let LOG_TEMPLATE = `[${new Date()}] [${message.author.username}] ${message.content} ${message.attachments.first() ? message.attachments.first().url : ""}\n`;
      fs.appendFileSync(`./logs/${user.id}.txt`, LOG_TEMPLATE);
    }
    let cat = message.guild.channels.cache.find((ch) => ch.type == "category" && ch.name == this.client.config.modmail.category);
    if (!cat) return this.client.error("Could not find ModMail category. Please create a ticket via DM (this only has to be done once) before manually creating tickets!", message);
    this.client.log("Ticket Created Manually", `Ticket created for ${user.tag} (ID: \`${user.id}\`)\n\nInitial Content: \`\`\`${content}\`\`\``, 440298, message);
    let embed = {
      author: {
        name: message.author.username,
        icon_url: message.author.displayAvatarURL(),
      },
      description: content,
      color: this.client.config.modmail.color,
      image: {},
    };
    if (message.attachments.first()) embed.image.url = message.attachments.first().url;
    user.send({ embed: { description: this.client.config.messages.newTicketManual } }).then(() => {
      user.send({ embed });
    });
    message.guild.channels.create(user.tag.replace("#", "-"), { reason: "New ModMail ticket", topic: `${this.client.config.messages.ticketDesc.replace("[p]", this.client.config.prefix)}`, parent: cat }).then((c) => {
      message.channel.send("Ticket created!");
      c.send({ embed });
    });
    logMail(user, message);
  }
};
