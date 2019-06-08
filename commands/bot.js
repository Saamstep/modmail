exports.run = (client, message, args) => {
	const pkg = require('../package.json');

	async function cmd() {
		await message.channel.startTyping(1);

		const embed = {
			color: 3447003,
			title: 'Creator:',
			description: 'This bot was made by Samstep',
			fields: [
				{
					name: 'Social Links:',
					value:
            '[YouTube](http://www.bit.ly/subtosamstep) **|** [Twitch](http://www.twitch.tv/saamstep) **|** [Twitter](http://www.twitter.com/saamstep) **|** [GitHub](http://gihub.com/saamstep)',
				},
				{
					name: 'Thank You:',
					value:
            '[AnIdiotsGuide](http://anidiots.guide), [Nullpointer](http://twitch.tv/nullpointer128) & [SpyderHunter03](https://twitter.com/SpyderHunter03) for all the help!',
				},
				{
					name: 'Bot Info:',
					value: `**${pkg.name} ${pkg.version}**\n${pkg.description}`,
				},
				{
					name: 'APIs:',
					value:
            '[DiscordJS](http://discord.js.org) **|** [Cat Fact](https://catfact.ninja) **|** [TheCatAPI](http://thecatapi.com) **|** [TheDogAPI](http://thedogapi.com) **|** [Coinbase](https://developers.coinbase.com/api/v2) **|** [OW API](example.com)',
				},
				{
					name: 'Dependencies:',
					value: JSON.stringify(pkg.dependencies, null, 4),
				},
			],
		};

		await message.channel.send({ embed });

		await message.channel.stopTyping(true);
	}
	cmd();
};

exports.description = 'Shows info about the bot.';
