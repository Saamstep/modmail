const { Command } = require("discord.js-commando");
const fetch = require("node-fetch");

module.exports = class botCommand extends Command {
  constructor(client) {
    super(client, {
      name: "bot",
      group: "utility",
      memberName: "bot",
      description: "Bot info",
      throttling: {
        usages: 2,
        duration: 5,
      },
    });
  }

  async run(message) {
    message.say({
      embed: {
        color: 4296191,
        author: {
          name: "Samstep",
          icon_url: "https://samstep.net/images/logo.png",
          url: "https://github.com/Saamstep",
        },
        description:
          "Bot by [Samstep](https://github.com/Saamstep). Made with [Discord.js Commando](https://github.com/discordjs/Commando#readme)\n\n**Thanks You:**\n[AnIdiots.guide](https://anidiots.guide)\n[Discordjs.guide](https://anidiots.guide)\n[Discordjs Support Server](https://discord.gg/bRCvFy9)\n[John Panos](https://github.com/johnpanos/)",
        fields: [
          {
            name: "Prefix",
            value: `\`${this.client.config.prefix}\``,
            inline: true,
          },
          {
            name: "Version",
            value: `\`${require("../../package.json").version}\``,
            inline: true,
          },
          {
            name: "Config File Version",
            value: `\`${this.client.config.version}\``,
            inline: true,
          },
          {
            name: "Docs",
            value: "https://github.com/Saamstep/modmail/blob/master/README.md",
          },
          {
            name: "Dependencies",
            value: `${Object.entries(require("../../package.json").dependencies).join("\n")}`,
          },
        ],
      },
    });
  }
};
