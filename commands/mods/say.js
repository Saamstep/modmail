const { Command } = require("discord.js-commando");

module.exports = class sayCommand extends Command {
  constructor(client) {
    super(client, {
      name: "say",
      group: "mods",
      memberName: "say",
      guildOnly: true,
      description: "Repeats what the user said.",
      examples: ["say Hello world"],
    });
  }

  run(message) {
    message.delete();
    this.client.log("Say Command", `Channel: <#${message.channel.id}>\nContent: \`\`\`\n${message.content.substring(this.client.options.commandPrefix.length + 3, message.content.length)}\`\`\``, 6233209, message);
    return message.say(message.content.substring(this.client.options.commandPrefix.length + 3, message.content.length));
  }
};
