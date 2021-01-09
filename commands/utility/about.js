const { Command } = require("discord.js-commando");
const fetch = require("node-fetch");

module.exports = class botCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "about",
      group: "utility",
      memberName: "about",
      description: "What is ModMail?",
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
        description: this.client.config.messages.about,
      },
    });
  }
};
