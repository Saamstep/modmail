const { Command } = require("discord.js-commando");

module.exports = class sendFileCommand extends Command {
  constructor(client) {
    super(client, {
      name: "sendfile",
      group: "admins",
      memberName: "sendfile",
      guildOnly: true,
      description: "Send a file as the bot (SVG files are NOT supported!)",
      examples: ["sendfile i.imgur.com/abcdef", "sendfile i.imgur.com/abcdef,i.imgur.com/ghijk,i.imgur.com/lmnop"],
      args: [
        {
          key: "file",
          prompt: "Enter the URL(s) of the file to send. You can send multiple files using a , in between each file URL.",
          type: "string",
        },
      ],
    });
  }

  run(message, { file }) {
    message.delete({ timeout: 1000 });
    message.channel.send("", {
      files: file.split(","),
    });
    this.client.log("sendfile", `Sent filestring ${file} in ${message.channel}`, 1231238, message);
  }
};
