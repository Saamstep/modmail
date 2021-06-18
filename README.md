<p align="center">
<img src="https://i.imgur.com/pRPIDxV.png" alt="drawing" width="200"/>
</p>

# ModMail <!-- omit in toc -->

![Maintenance](https://img.shields.io/maintenance/yes/2021?style=plastic)
![GitHub package.json version](https://img.shields.io/github/package-json/v/saamstep/modmail)
![GitHub repo size](https://img.shields.io/github/repo-size/saamstep/modmail)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/saamstep/modmail/discord.js)
![Discord Support](https://img.shields.io/discord/602225388034457610?label=Discord%20Support&labelColor=FFFFF&style=plastic&logo=Discord&link=http://samstep.net/devcord&link=http://samstep.net/devcord)
[![Run on Repl.it](https://repl.it/badge/github/saamstep/modmail)](https://repl.it/github/saamstep/modmail)

Made by [Samstep](https://twitter.com/saamstep) with guidance from [anidiots.guide](http://anidiots.guide), [discordjs.guide](https://discordjs.guide/), and the [Discord.JS Community](https://discord.gg/bRCvFy9)!

# 1. Features
* Per user ticket channels
* Open tickets for users with a command
* Block users from using modmail
* Disable/enable modmail on command
* "Quick reply" snippets

> Screenshots & video coming soon!

# 2. Commands
* Utility
  * about: What is ModMail?
  * bot: Bot info
  * discord: Check Discord server status
  * help: Displays a list of available commands, or detailed information for a specified command.
  * ping: Checks the bot's ping to the Discord server.
  * eval: Executes JavaScript code.

* Mods
  * block: Block or unblock a user from using ModMail.
  * edit: Edits a message the bot sent
  * lock: Toggle ModMail ticketing system. When disabled, normal users will not be able to send messages to ModMail, but staff roles will be able to send messages. When enabled, normal users can use ModMail as designed.
  * open: Open a ticket for a user
  * say: Repeats what the user said.
  * snippets: View, create, and delete snippets that can be used as "quickreplies" in ModMail channels. Use a snippet in the ModMail
  channel by typing `snippet [#]`

* Admins
  * announce: Make a formatted announcement using Embed data
  * dmall: Direct message a user.
  * makeinv: Create an invite to a specified channel
  * modules: Manage modules
  * sendfile: Send a file as the bot (SVG files are NOT supported!)

* Settings
  * setchannel: Update channel key values
  * setprefix: Change the server prefix (mention will always work)
  * setrole: Update role key values

* Commands
  * groups: Lists all command groups.
  * enable: Enables a command or command group.
  * disable: Disables a command or command group.
  * reload: Reloads a command or command group.
  * load: Loads a new command.
  * unload: Unloads a command.

* ModMail Ticket Channel **Only** Commands
  * close
    * Close a ticket channel
  * cmds
    * Shows you all ModMail ticket commands
  * snippet
    * Open the snippet menu and choose a snippet to send
  * block
    * Block this user
  * lock
    * Disable all modmail messages




# 3. Requirements
* File system access
* [NodeJS](https://node.js.org) v12.18.1 minimum
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

> This guide will not cover installing NodeJS.

# 4. Documentation

## 4.1. Setup
1. Clone the repository `git clone https://github.com/Saamstep/modmail.git`
2. Change your working directory `cd modmail/`
3. Install NPM modules `npm install`
4. Copy the example config file and edit it accordingly (See the Config File section below) `cp example.config.json config.json`
5. Run the bot with `node .` OR use [pm2](https://pm2.io) to keep it alive (See PM2 section)
6. Invite your bot using my [Invite Generator](https://samstep.net/invite-generator.html). You need your client ID which is found in your [Developer Portal](https://discord.com/developers/applications)

## 4.2. Config File
| Key      |    Value Type     |                                                                                                                                                          Description |
| -------- | :---------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| token    |      String       |                                                                         Application token from your [Developer Portal](https://discord.com/developers/applications). |
| version  |      Integer      |                                                                                                                              Config version. **DO NOT CHANGE THIS!** |
| prefix   |      String       |                                                                                                                              Prefix used to invoke all bot commands. |
| debug    |      Boolean      |                                                                                                            For developer purposes of debugging, you may ignore this. |
| ownerid  |      String       |                                                                                                                                         The user ID of the bot owner |
| status   |   Array(Object)   |                                                                                        Status messages for the bot. View the seperate section below for more options |
| apiKeys  | Key/Value(String) |                                                           There is only one value in here for the uptime webserver. Read the webserver section for more information. |
| modmail  |       Misc        |                                                                                   Some specific modmail settings. Read the modmail section below for more specifics. |
| messages | Key/Value(String) |                                                                                                                   Customize some of the messages that the bot sends. |
| snippets |   Array(String)   |                                                                                                     Quick reply snippets that are usable in ModMail ticket channels. |
| role     | Key/Value(String) |                                                                                                                Permission roles, takes both role ids and role names. |
| loops    | Key/Value(String) |                                    Do not edit this! This keeps the status messages rolling. If you do not want a status message, set the key `"status"` to `false`. |
| services | Key/Value(String) | Do not edit this! This keeps an uptime webserver running. If you do not want a uptime webserver or do not know what it is you can set the key `"uptime"` to `false`. |
| channel  | Key/Value(String) |                                   Text channels to configure the bot to use. `"log"` is the audit log channel for the bot. Channels can be a role id or a role name. |

### 4.2.1. `status`
One status message is built with an object with two key/value pairs. 
- type
  - The type of status, must be either a string containing `PLAYING`, `STREAMING`, or `WATCHING`.
- msg
  - String of text that you want to display after the status type prefix. 

```
{
    "type": "PLAYING",
    "msg": "games"
}
```
This status would display: **Playing games**

![Status Example](https://i.imgur.com/WY7rBMR.png)

### 4.2.2. `modmail`
- guild
  - String of the guild ID to enable the modmail system
- enabled
  - Boolean to enable and disable the Modmail system, this is what the `lock` command uses.
- category
  - The name of the channel category to file modmail tickets under.
- rolesAllowed
  - Array of a string of role ids or role names that also can see ModMail tickets (Mods/Admins automatically get added)
- color
  - A decimal color value to apply to ModMail embed messages.
- blockedUsers
  - An array of blocked user ids.

### 4.2.3. `messages`
- ticketDesc
  - Ticket channel descriptions. [p] gets replaced with bot prefix.
- newTicket
  - Initial message sent to users when they make a new ticket.
- newTicketManual
  - Initial message sent to users when a new ticket is opened for them using the `open` command.
- closedTicket
  - Message to send to a user when their ticket is closed.
- blockedUserError
  - Message to send to a user when they interact with modmail when they are blocked.
- disabled
  - Message to send to a user when they interact with modmail when ModMail is disabled.
- about
  - Message displayed when "about" command is run.

### `uptime` webserver
This webserver is used by me to easily check if my bot is online. You can use it if you want, or you can disable it as shown in the Config File section. The uptime webserver requires password in the header. The header must be `key` and the value can be anything you want. You can set this value in the Config File under `apiKeys.api`.

### What is a key value pair?
A key value pair is where data is stored and referenced using a key and the value is given based on that key. Still confused? Checkout this tutorial https://javascript.info/object. If the bot asks you for a key when updating a config property (for example when using [p]setchannel). You pass the key `log` to modify the value (channel name/id) that corresponds to the log channel. 

## 4.3. PM2
PM2 is a node module that can be easily installed and setup to keep your bot online 24/7 and auto start it if your host machine disconnects. Read the steps below to integrate pm2.

1. (In your bot's directory) Install pm2 with `npm install pm2 -g`
2. Run `pm2 start index.js --name "ModMail` The name `ModMail` can be whatever you want. It is just easy to remember.
3. Access the logs of your bot with `pm2 logs ModMail`
4. Read more pm2 commands here.

## 4.4 Repl.it Hosting
Using the deploy button at the top of this repository is an option for hosting. However, make sure to [store your secrets safely](https://docs.replit.com/repls/secrets-environment-variables). It is **required** to at least store your Discord Bot token this way to keep it safe from attackers. 
