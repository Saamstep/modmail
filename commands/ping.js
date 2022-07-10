module.exports = {
  name: "ping",
  description: "See bot response time. Ping!",
  perm: 0,
  execute(client, message, args) {
    message.channel.send(`> Latency: ?ms`).then(async (m) => {
      m.edit(`> Latency: ${m.createdTimestamp - message.createdTimestamp}ms`);
    });
  },
};
