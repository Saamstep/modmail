module.exports = {
  name: "delete",
  description: "Remove ticket by user ID in database. DO NOT DO THIS UNLESS YOU KNOW WHAT YOU ARE DOING",
  perm: 1,
  async execute(client, message, args, Tickets) {
    client.users.fetch(args[0]).catch((e) => {
      return message.reply("Could not find this user");
    });

    let removed = await Tickets.destroy({ where: { member: args[0] } });

    message.reply(`Removed ${removed} tickets.`);
  },
};
