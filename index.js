const Discord = require('discord.js');
const client = new Discord.Client({ autoReconnect: true });
const ConfigService = require('./config.js');
const fs = require('fs');

//modules init.
client.isAdmin = require('./modules/isAdmin.js');
client.isMod = require('./modules/isMod.js');
client.isOwner = require('./modules/isOwner.js');
client.error = require('./modules/errorMod.js');
client.console = require('./modules/consoleMod.js');
client.log = require('./modules/logMod.js');
client.ConfigService = require('./config.js');

client.login(client.ConfigService.config.token);

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir('./events/', (err, files) => {
  if (err) return client.console(err);
  files.forEach(file => {
    if (file.startsWith('.')) {
      return;
    }
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split('.')[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});

//cooldown
const talkedRecently = new Set();
module.exports = function cooldown(message, code) {
  const error = require('./modules/errorMod.js');

  if (talkedRecently.has(message.author.id)) {
    return error('Wait 6 seconds before typing this again.', message);
  } else {
    code();
    talkedRecently.add(message.author.id);
    setTimeout(() => {
      talkedRecently.delete(message.author.id);
    }, 6000);
  }
};

client.on('message', message => {
  //mention prefix

  // ModMail System
  if (message.channel.type == 'dm' && !message.author.bot) {
    const embed = {
      title: `From: ${message.author.tag}`,
      description: `${message.content}`,
      color: 11929975,
      timestamp: Date.now(),
      footer: {
        icon_url: client.user.avatarURL,
        text: 'ModMail'
      },
      thumbnail: {
        url: 'http://icon-park.com/imagefiles/paper_plane_navy_blue.png'
      },
      author: {
        name: `New ModMail message recieved!`,
        icon_url: `${message.author.avatarURL}`
      },
      fields: [
        {
          name: '\nReply:',
          value: `<@${message.author.id}>`
        }
      ]
    };

    // >> For now these values need to be modified manually :(
    let guild = client.guilds.get(`${client.ConfigService.config.guildID}`);
    if (guild) {
      let channel = guild.channels.get(`${client.ConfigService.config.channel.modmail}`);
      channel.send({ embed }).then(m => {
        m.react('✅');
      });
      client.console(`Recieved ModMail from ${message.author.tag} and sent it to the mod channel.`);
    }
  }

  if (message.content.startsWith(`<@${client.user.id}> help`)) {
    let helpFile = require('./commands/help.js');
    helpFile.run(client, message);
  }
  if (message.content.startsWith(`<@${client.user.id}> prefix`)) {
    let helpFile = require('./commands/help.js');
    helpFile.run(client, message);
  }
  if (message.content.startsWith(`<@${client.user.id}>`)) {
    let helpFile = require('./commands/help.js');
    helpFile.run(client, message);
  }

  // Command file manager code
  if (!message.guild || message.author.bot) return;
  if (!message.content.includes(ConfigService.config.prefix)) return;
  let command = message.content.split(' ')[0];
  command = command.slice(config.prefix.length);
  client.config = config;
  let args = message.content.split(' ').slice(1);

  // Regular command file manager
  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
    message.channel.stopTyping(true);
  } catch (err) {
    if (config.debug === true) {
      console.error(err);
    }
  }

  // Custom command file manager
  try {
    let commandFile = require(`./commands/cc/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    if (config.debug === true) {
      console.error(err);
    } else {
      return;
    }
  }
});
