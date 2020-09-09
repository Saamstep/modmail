const { Command } = require("discord.js-commando");

module.exports = class announceCommand extends Command {
  constructor(client) {
    super(client, {
      name: "announce",
      group: "admins",
      memberName: "announce",
      description: "Make a formatted announcement using Embed data",
      guildOnly: true,
      // format: "announce [#channel] [message goes here]\nannounce edit [message id] [new message]\nannounce append [message id] [text to append\nannounce embed [embed JSON]",
      // examples: [""],
      args: [
        {
          key: "option",
          prompt: `Please choose a valid option \`msg, embed, append, edit\``,
          type: "string",
          oneOf: ["edit", "append", "embed", "msg"],
          // validate: (option) => option == "edit" || option == "append" || option == "embed" || option.test(/<((#\d+)|(:.+?:\d+))>/g)
        },
        {
          key: "id",
          prompt: "Please provide a message id to edit or mention a channel to send this message to",
          type: "string",
          validate: (id) => id.includes("#") || id.includes("0") || id.includes("1") || id.includes("2") || id.includes("3") || id.includes("4") || id.includes("5") || id.includes("6") || id.includes("7") || id.includes("8") || id.includes("9"),
        },
        {
          key: "body",
          prompt: "Please provide some body text (embed format)",
          type: "string",
        },
      ],
    });
  }

  run(message, { option, id, body }) {
    switch (option) {
      case "edit":
        try {
          message.channel.messages.fetch(id).then((m) => {
            m.edit({
              embed: {
                description: body,
              },
            });
          });
        } catch (e) {
          return this.client.error(e + "Channel not found, you must run in same channel as message!", message);
        }
        break;
      case "append":
        try {
          message.channel.messages.fetch(id).then((m) => {
            m.edit({
              embed: {
                description: m.embeds[0].description + " " + body,
              },
            });
          });
        } catch (e) {
          return this.client.error("Channel not found, you must run in same channel as message!", message);
        }
        break;
      case "embed":
        try {
          let announceChannel = this.client.channels.cache.get(`${id.replace(/</g, "").replace(/>/g, "").replace(/#/g, "")}`);
          announceChannel.send({
            embed: JSON.parse(body),
          });
        } catch (e) {
          return this.client.error(e, message);
        }
        break;
      case "msg":
        try {
          let announceChannel = this.client.channels.cache.get(`${id.replace(/</g, "").replace(/>/g, "").replace(/#/g, "")}`);
          announceChannel.send({ embed: { description: body } });
        } catch (e) {
          return this.client.error(e, message);
        }
        break;
    }
    message.delete({ timeout: 0 });
  }
};
