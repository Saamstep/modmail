const inquirer = require("inquirer");
const fs = require("fs");
const consola = require("consola");

let template = require("../example.config.json");

async function setup() {
  if (fs.existsSync("./settings.json")) {
    consola.warn("settings.json already exists! This will overwrite the file. CTRL + C to exit.");
  }

  if (fs.existsSync("./.env")) {
    consola.warn(".env already exists! This will overwrite the file. CTRL + C to exit.");
  }

  const questions = [
    {
      type: "input",
      name: "bot_token",
      message: "Enter bot token from Discord Developer Portal. https://discord.com/developers/applications/",
    },
    {
      type: "input",
      name: "app_id",
      message: "Enter the application ID from Discord Developer Portal.",
    },
    {
      type: "input",
      name: "primaryGuildID",
      message: "Enter the server ID of the primary server the bot will take support requests.",
    },
    {
      type: "input",
      name: "p_categoryID",
      message: "Enter the ID of the category for ModMail requests to be attached to, leave this blank for the bot to create one automatically.",
    },
    {
      type: "confirm",
      default: false,
      name: "logToStaff",
      message: "Do you have a separate staff server? (Say Yes if you want to log ModMail actions in your secondary server.)",
    },
    {
      type: "input",
      name: "p_logChannel",
      message: "Enter the ID of the channel for ModMail to log actions.",
    },
    {
      type: "input",
      name: "readAccess",
      message: "Enter role IDs or user IDs who should have ability to read ModMail tickets. (separate by comma)",
    },
    {
      type: "input",
      name: "writeAccess",
      message: "Enter role IDs or user IDs who should have ability to read and respond to ModMail tickets. (separate by comma)",
    },
  ];

  const questions2 = [
    {
      type: "input",
      name: "staffGuildID",
      message: "Enter the server ID of the staff server, the bot will make the HUD channel here.",
    },
    {
      type: "input",
      name: "hudChannel",
      message: "Enter the ID of the channel for ModMail to use as the HUD.",
    },
  ];

  const ans = await inquirer.prompt(questions);
  const ans2 = ans.logToStaff ? await inquirer.prompt(questions2) : null;

  //No Staff Guild
  template.primaryGuild.id = ans.primaryGuildID;
  template.primaryGuild.logChannel = ans.logToStaff ? "" : ans.p_logChannel;
  template.primaryGuild.categoryID = ans.p_categoryID;
  template.readAccess = ans.readAccess.includes(",") ? ans.readAccess.split(",") : [ans.readAccess];
  template.writeAccess = ans.writeAccess.includes(",") ? ans.writeAccess.split(",") : [ans.writeAccess];
  template.logToStaff = ans.logToStaff;

  if (ans.logToStaff) {
    template.staffGuild.id = ans2.staffGuildID;
    template.staffGuild.logChannel = ans.logToStaff ? ans.p_logChannel : "";
    template.staffGuild.hudChannel = ans2.hudChannel;
  }

  fs.writeFile("./settings.json", JSON.stringify(template, null, 3), (err) => {
    if (err) {
      consola.error("Unable to create config file.\n\n" + e);
      exit(1);
    }
    consola.success("Config file created!");
  });

  const ENV_OUTPUT = `TOKEN=${ans.bot_token}\nDB_USER=admin\nDB_PASSWORD=${Math.random().toString(36).slice(-20)}`;

  fs.writeFile("./.env", ENV_OUTPUT, (err) => {
    if (err) {
      consola.error("Environment file could not be created.\n\n" + e);
      exit(1);
    }
    consola.success(`\n\nInvite bot to your server using the following url:\nhttps://discord.com/oauth2/authorize?&client_id=${ans.app_id}&scope=applications.commands+bot&permissions=534723947600`);
  });
}

setup();
