const { Command } = require("discord.js-commando");
const fetch = require("node-fetch");
const fs = require("fs");
module.exports = class modulesCommand extends Command {
  constructor(client) {
    super(client, {
      name: "modules",
      group: "admins",
      memberName: "modules",
      description: "Manage modules",
      guildOnly: true,
      args: [
        {
          key: "option",
          prompt: "Please choose a valid option",
          type: "string",
          default: "list",
        },
      ],
    });
  }

  async run(message, { option }) {
    let args = message.content.split(" ").slice(1);
    switch (option.split(" ")[0]) {
      case "install":
        //Bot will only allow you to install modules from here.
        const approvedRepos = ["Saamstep/djsbot-modules"];
        if (!args[1]) return this.client.error("Please specify a repo to install", message);
        if (!args[1].includes("github")) return this.client.error("Please specify a valid url", message);
        let repo = args[1].split("/");
        if (repo.length !== 9 || repo[repo.length - 1].substring(repo.length - 1, repo.length + 1) !== "js" || approvedRepos.some((r) => r !== `${repo[3]}/${repo[4]}`)) return this.client.error("Invalid repository", message);
        let getModule = await fetch(`https://raw.githubusercontent.com/${repo[3]}/${repo[4]}/${repo[6]}/${repo[7]}/${repo[8]}`);
        let code = await getModule.text();
        if (code == "404: Not Found") return this.client.error("That file could not be found, make sure you spelled it correctly!", message);
        switch (repo[7]) {
          case "loop":
            fs.writeFile(`./modules/loop/${repo[8]}`, code, (err) => {
              if (err) throw err;
              // @TODO -> add system to enable config file
              let localConf = this.client.config;
              localConf.loops[repo[8].split(".")[0]] = true;

              fs.writeFile("./config.json", JSON.stringify(localConf, null, 3), (err) => {
                if (err) throw err;
                message.say("Module installed successfully");
                this.client.log("New Module Installed", `Installed new loop module \`${repo[8]}\`. Please restart the bot to activate the module.`, 230937, message);
              });
            });
            break;
          case "service":
            fs.writeFile(`./modules/service/${repo[8]}`, code, (err) => {
              if (err) throw err;
              let localConf = this.client.config;
              localConf.services[repo[8].split(".")[0]] = true;

              fs.writeFile("./config.json", JSON.stringify(localConf, null, 3), (err) => {
                if (err) throw err;
                message.say("Module installed successfully");
                this.client.log("New Module Installed", `Installed new service module \`${repo[8]}\`. Please restart the bot to activate the module.`, 230937, message);
              });
            });
            break;
          default:
            this.client.error(`Invalid repository path \`${repo[7]}\``, message);
        }
        break;
      case "enable":
        if (this.client.config.services[`${args[1]}`] == undefined && this.client.config.loops[`${args[1]}`] == undefined) return this.client.error("Could not find that service or loop module", message);
        if (this.client.config.services[`${args[1]}`] || this.client.config.loops[`${args[1]}`]) return this.client.error("Already enabled", message);
        if (this.client.config.services[`${args[1]}`] == undefined) {
          let localConf = this.client.config;
          localConf.loops[`${args[1]}`] = true;

          fs.writeFile("./config.json", JSON.stringify(localConf, null, 3), (err) => {
            if (err) throw err;
            message.say("Module enabled successfully");
            this.client.log("Module Enabled", `Service module \`${args[1]}\`. Please restart the bot to activate the module.`, 230937, message);
          });
        } else {
          let localConf = this.client.config;
          localConf.services[`${args[1]}`] = true;

          fs.writeFile("./config.json", JSON.stringify(localConf, null, 3), (err) => {
            if (err) throw err;
            message.say("Module enabled successfully");
            this.client.log("Module Enabled", `Service module \`${args[1]}\`. Please restart the bot to activate the module.`, 230937, message);
          });
        }
        break;
      case "disable":
        if (this.client.config.services[`${args[1]}`] == undefined && this.client.config.loops[`${args[1]}`] == undefined) return this.client.error("Could not find that service or loop module", message);
        if (this.client.config.services[`${args[1]}`] == false || this.client.config.loops[`${args[1]}`] == false) return this.client.error("Already disabled", message);
        if (this.client.config.services[`${args[1]}`] == undefined) {
          let localConf = this.client.config;
          localConf.loops[`${args[1]}`] = false;

          fs.writeFile("./config.json", JSON.stringify(localConf, null, 3), (err) => {
            if (err) throw err;
            message.say("Module disabled successfully");
            this.client.log("Module Disabled", `Service module \`${args[1]}\`. Please restart the bot to deactivate the module.`, 230937, message);
          });
        } else {
          let localConf = this.client.config;
          localConf.services[`${args[1]}`] = false;

          fs.writeFile("./config.json", JSON.stringify(localConf, null, 3), (err) => {
            if (err) throw err;
            message.say("Module disabled successfully");
            this.client.log("Module Disabled", `Service module \`${args[1]}\`. Please restart the bot to deactivate the module.`, 230937, message);
          });
        }
        break;
      default:
        let conf = this.client.config.services;
        let data = '"Services"\n';
        // console.log(this.client.config.services);
        Object.keys(this.client.config.services).forEach(function (service) {
          data += `${service} => ${conf[service]}\n`;
        });
        data += '\n"Loops"\n';
        conf = this.client.config.loops;
        Object.keys(this.client.config.loops).forEach(function (loop) {
          data += `${loop} => ${conf[loop]}\n`;
        });
        message.say(`\`\`\`js\n${data}\`\`\``);
        break;
    }
  }
};
