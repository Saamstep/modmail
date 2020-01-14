exports.run = async (client, message, args, veriEnmap, cc) => {
  fs = require("fs");
  var m = JSON.parse(fs.readFileSync("./config.json").toString());
  const data = m;

  function hasNoDisabled(input) {
    if (input == "token" || input == "ownerid" || input.includes("apis")) {
      return true;
    } else {
      return false;
    }
  }
  function push(out) {
    fs.writeFileSync("./config.json", JSON.stringify(out, null, 4));
  }

  switch (args[0]) {
    case "add":
      break;
    case "remove":
      break;
    case "edit":
      //make sure we dont edit something that shouldn't be
      if (hasNoDisabled(args[1])) return client.error("You cannot edit that!", message);
      //dot prop
      if (args[1].includes(".")) {
        let copy = args[1].split(".");
        if (copy.length == 2) {
          if (data[`${copy[0]}`][`${copy[1]}`] == undefined) return client.error(`The property \`${args[1]}\` does not exist!`, message);
          if (Array.isArray(data[`${copy[0]}`][`${copy[1]}`])) {
            data[`${copy[0]}`][`${copy[1]}`] = args[2];
          } else if (typeof data[`${copy[0]}`][`${copy[1]}`] === "boolean") {
            out = true;
            if (args[2] == "false") out = false;
            data[`${copy[0]}`][`${copy[1]}`] = out;
          } else {
            data[`${copy[0]}`][`${copy[1]}`] = args[2];
          }
        }
        //TODO integrate double dot accessor
        push(data);
      } else {
        //array prop
        if (Array.isArray(data[args[1]])) {
          if (args[2].includes("-")) {
            data[args[1]].splice(data[args[1]].indexOf(args[2].substring(1, args[2].length)), 1);
            push(data);
            return message.channel.send(`Removed property from: \`${args[1]}\`:  \`${args[2]}\``);
          } else {
            data[args[1]].push(args[2]);
            push(data);
            return message.channel.send(`Added property to \`${args[1]}\`: \`${args[2]}\``);
          }
        } else {
          //normal prop
          data[args[1]] = args[2];
          push(data);
        }
      }

      //array
      // if()
      message.channel.send(`Updated property \`${args[1]}\` to \`${args[2]}\``);
      var spawn = require("child_process").spawn;

      (function main() {
        if (process.env.process_restarting) {
          delete process.env.process_restarting;
          // Give old process one second to shut down before continuing ...
          setTimeout(main, 1000);
          return;
        }

        // ...

        // Restart process ...

        spawn(process.argv[0], process.argv.slice(1), {
          env: { process_restarting: 1 },
          stdio: "ignore"
        }).unref();
      })();
      break;
    default:
      let msg = `${client.user.username} Settings | Change these config properties (except owner ID lol)\nExample: ${client.ConfigService.config.prefix}settings edit <dot.notation> [newValue] (General does not require dot notation)\n---------------\n<General>\n`;
      for (i in data) {
        if (i == "apis" || i == "token" || i == "mail") continue;
        if (Object.prototype.toString.call(data[i]) === "[object Object]") {
          for (k = 0; k < Object.keys(data[i]).length; k++) {
            if (!msg.includes(i)) msg += "\n<" + i + ">\n";
            msg += "< " + Object.keys(data[i])[k] + " > ";
            if (Array.isArray(Object.values(data[i])[k])) {
              msg +=
                Object.values(data[i])
                  [k].join(" | ")
                  .replace("_", "-") + "\n";
            } else {
              msg += Object.values(data[i])[k] + "\n";
            }
          }
        } else {
          let output = data[i];
          if (Array.isArray(output)) output = data[i].join(" | ").replace("_", "-");
          msg += "< " + i + " > " + output + "\n";
        }
      }
      message.channel.send(`\`\`\`md\n${msg}\`\`\``);
      break;
  }
};
exports.cmd = {
  enabled: true,
  category: "Utility",
  level: 2,
  description: "View and change bot settings"
};
