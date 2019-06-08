exports.run = (client, message, args) => {

  const isOwner = require('../modules/isOwner.js');


  const cooldown = require('../index.js');

  function cmd() {
    message.channel.send('Pinging...').then(sent => {
      sent.edit(
        `Pong! Response time: ${sent.createdTimestamp -
        message.createdTimestamp}ms`
      );
    });
  }




  if (isOwner(message, false)) {
    message.channel.send('Pinging...').then(sent => {
      sent.edit(
        `Pong! Response time: ${sent.createdTimestamp -
        message.createdTimestamp}ms`
      );
    });
  } else {
    return cooldown(message, cmd);
  }
};
exports.description = 'Pings the bot.';
