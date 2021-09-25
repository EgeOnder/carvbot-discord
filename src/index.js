const { Client, Intents } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const intents = new Intents();
intents.add(
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_BANS,
	Intents.FLAGS.DIRECT_MESSAGES,
	Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
	Intents.FLAGS.DIRECT_MESSAGE_TYPING,
	Intents.FLAGS.GUILD_MESSAGE_TYPING,
	Intents.FLAGS.GUILD_PRESENCES,
	Intents.FLAGS.GUILD_MESSAGE_TYPING,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_INVITES,
	Intents.FLAGS.GUILD_INTEGRATIONS
);

const client = new Client({ disableEveryone: true, intents: intents });
const queue = new Map();
const prefix = process.env.PREFIX || '-';

client.commands = new Discord.Collection();

let commands = [];

fs.readdir('./src/commands/', (error, files) => {
	if (error) console.error(error);

	const jsfiles = files.filter((f) => f.split('.').pop() == 'js');
	if (jsfiles.length <= 0) return console.log('No commands to load!');

	console.log(`Loading ${jsfiles.length} command(s).`);

	jsfiles.forEach((f, i) => {
		commands.push(f.split('.')[0]);
		const props = require(`./commands/${f}`);
		try {
			client.commands.set(props.help.name, props);
			console.log(`${f} loaded!`);
		} catch (error) {
			console.error(error);
		}
	});
});

client.on('ready', () => {
	console.log('Carvbot is ready!');
	client.user.setActivity(`${prefix}help`, { type: 'LISTENING' });
});

client.on('message', async (message) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.substring(prefix.length).split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(._)/g, '$1') : '';
	const serverQueue = queue.get(message.guild.id);

	const commandFile = client.commands.get(
		message.content.split(' ')[0].slice(prefix.length)
	);
	if (commandFile)
		commandFile.run(
			client,
			message,
			args,
			url,
			searchString,
			queue,
			serverQueue
		);

	if (message.content.startsWith(prefix)) {
		if (commands.length > 0) {
			if (
				!commands.includes(
					message.content.split(' ')[0].split(prefix)[1]
				)
			) {
				const cannotUnderstandEmbed = new Discord.MessageEmbed()
					.setColor('#ff0000')
					.setTitle(
						`:x: Komutunu tam olarak anlayamadım. Yardım almak için **${prefix}help**`
					)
					.setTimestamp();

				return message.channel.send(cannotUnderstandEmbed);
			}
		} else {
			const noCommandFoundEmbed = new Discord.MessageEmbed()
				.setColor('#ff0000')
				.setTitle(':x: Herhangi bir komut bulamadım.')
				.setTimestamp();

			return message.channel.send(noCommandFoundEmbed);
		}
	}

	return undefined;
});

client.login(process.env.BOT_TOKEN);
