const { Command } = require("discord.js-commando");

module.exports = class sayCommand extends Command {
  constructor(client) {
    super(client, {
      name: "edit",
      group: "mods",
      memberName: "edit",
      guildOnly: true,
      description: "Edits a message the bot sent",
      examples: ["say Hello world"],
      args: [
        {
          key: "messageid",
          prompt: "Please provide the message ID for the message you want to edit. The bot can ONLY edit its own messages.",
          type: "message",
        },
        {
          key: "content",
          prompt: "Please type in the new content for this message",
          type: "string",
        },
      ],
    });
  }

  run(message, { messageid, content }) {
    message.delete();
    if (messageid.author.id !== this.client.user.id) return this.client.error("This must be a message that the bot, " + this.client.user.username + " sent", message);
    messageid.edit(content);
    this.client.log("Bot Message Edited", `A message in **#${messageid.channel.name}** was edited\n\n[[Jump]](${messageid.url})`, 1232038, message);
  }
};
