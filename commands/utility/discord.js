const { Command } = require("discord.js-commando");
const fetch = require("node-fetch");

module.exports = class discordStatusCommand extends Command {
  constructor(client) {
    super(client, {
      name: "discord",
      group: "utility",
      memberName: "discord",
      description: "Check Discord server status",
      examples: ["discord"],
      throttling: {
        usages: 2,
        duration: 5,
      },
    });
  }

  async run(message) {
    const req = await fetch("https://srhpyqt94yxb.statuspage.io/api/v2/status.json");
    const resp = await req.json();
    return message.say(resp.status.description == "All Systems Operational" && resp.status.indicator == "none" ? resp.status.description : `There seems to be a problem with the Discord server(s).\n\`\`\`${resp.status.description}\`\`\``);
  }
};
