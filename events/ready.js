const ConfigService = require("../src/config.js");
const colors = require("colors");
const fetch = require("node-fetch");
const commandsFolder = "./commands/";
const CommandList = require("../src/commandList.js");
const fs = require("fs").promises;

exports.run = async function(client, member, message) {
  const guildNames = client.guilds.map(g => g.name).join("\n");
  // client.user
  //   .setPresence({
  //     game: { name: `${ConfigService.config.defaultGame}`, type: 3 }
  //   })
  //   .catch(console.error);

  // Iterate over all commands in command folder and add to CommandList
  try {
    const commands = await fs.readdir(commandsFolder);
    commands.forEach(file => {
      if (file === "cc") {
        return;
      }
      if (file.startsWith(".")) {
        return;
      } else {
        let cmdfiles = require(`../commands/${file}`);
        CommandList.addCommand(file.toString().replace(".js", ""), false, cmdfiles.description);
      }
    });
  } catch (e) {
    console.log(e);
    console.error("No commands were found to load! If you see this error you likely cloned the bot incorrectly and left some files behind!".red.bold);
    process.exit(1);
  }

  // Discord status URL
  var url = "https://srhpyqt94yxb.statuspage.io/api/v2/status.json/";

  // Start discord status
  const response = await fetch(url);

  const body = await response.json();

  if (!response.ok) {
    throw Error("Error: DISCORD_STATUS_REQUEST. Please tell the bot author.");
  }

  if (body.status.description == "All Systems Operational") {
    console.log("\nAll Discord systems operational!\n".green.dim);
  } else {
    console.log("There seems to be an error with some of the Discord Servers. Double check https://status.discordapp.com/ \n".red);
  }
  // End discord status
  const cmds = await fs.readdir(commandsFolder);
  console.log("Loading ".green + cmds.length + " commands".green + " and ".green + client.ccSize + " custom commands".green);
  console.log(`ModMail` + " online!\n".green.reset + "Connected to: ".cyan + guildNames.white + " guild(s)".cyan);
  console.log("Watching for modmail...".green);
  if (ConfigService.config.debug === "on") {
    console.log("\n");
  }
  client.user.setPresence({
    game: { name: `${client.ConfigService.config.status[0]}`, type: 0 }
  });
  let init = 0;
  function loopStatus() {
    let status = client.ConfigService.config.status;
    client.user.setPresence({
      game: { name: `${client.ConfigService.config.status[init]}`, type: 0 }
    });

    init++;
    if (init >= status.length) init = 0;
  }
  setInterval(loopStatus, 180000);
};
