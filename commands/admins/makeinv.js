const { Command } = require("discord.js-commando");

module.exports = class makeinvCommand extends Command {
  constructor(client) {
    super(client, {
      name: "makeinv",
      group: "admins",
      memberName: "makeinv",
      description: "Create an invite to a specified channel",
      examples: ["makeinv #general"],
      clientPermissions: ["CREATE_INSTANT_INVITE"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 5,
      },
      args: [
        {
          key: "channel",
          prompt: "Enter the channel to create an invite for.",
          type: "channel",
        },
      ],
    });
  }

  run(message, { channel }) {
    channel
      .createInvite(
        {
          maxAge: 0,
        },
        "Bot 'makeinv' command"
      )
      .then((inv) => {
        message.channel.send(`> Your new invite bound to channel **#${channel.name}** has been created! https://discord.gg/${inv.code}`);
        this.client.log("makeinv", `Made invite code \`${inv.code}\` for ${channel}`, 1231238, message);
      });
  }
};
