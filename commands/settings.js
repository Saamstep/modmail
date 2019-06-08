exports.run = (client, message, args) => {
  const fs = require('fs');

  // fs.readFile('./config.json', 'utf8', (err, data) => {
  //   let file = JSON.stringify(data, null, 4);
  //   message.channel.send(`\`\`\`${file}\`\`\``);
  // });
  let conf = require('../config.json');
  var msg = '';
  // for (i in conf) {
  //   msg += Object.keys(conf) + ': ' + conf[i] + '\n';
  // }
  Object.keys(conf).forEach(function(key) {
    if (typeof conf[key] === 'object') {
      // msg += key + ': ' + JSON.stringify(conf[key], null, 4) + '\n';
      for (i in JSON.stringify(conf[key], null, 4)) {
        msg += conf[key];
      }
    } else {
      msg += key + ': ' + conf[key] + '\n';
    }
  });
  client.console(msg);
};

//remove logging token...
//do a for() each for typeof object for cleaner look.

exports.description = 'Allows admins to update bot settings';
