exports.run = async (client, message, args) => {
  const os = require("os");

  const embed = {
    color: 11201432,
    timestamp: Date.now(),
    author: {
      name: "System Stats"
    },
    fields: [
      { name: "OS Info", value: `${os.type()} ${os.arch()}` },
      {
        name: "Free Memory",
        value: `${Math.round(os.freemem() / 1000000000)}GB/${Math.round(os.totalmem() / 1000000000)}GB`
      },
      {
        name: "Machine Uptime",
        value: `${Math.round(os.uptime() / 60)} minutes`
      }
    ]
  };

  message.channel.send({ embed });
};

exports.cmd = {
  enabled: true,
  category: "Utility",
  level: 0,
  description: "Get host system information"
};
