const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Discord.Client({ disableEveryone: true });
const queue = new Map();
const prefix = process.env.PREFIX || '-';

client.commands = new Discord.Collection();

let commands = [];

fs.readdir('./src/commands/', (error, files) => {
	if (error) console.error(error);

	const jsfiles = files.filter(f => f.split('.').pop() == 'js');
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

	const commandFile = client.commands.get(message.content.split(' ')[0].slice(prefix.length));
	if (commandFile) commandFile.run(client, message, args, url, searchString, queue, serverQueue);

	if (message.content.startsWith(prefix)) {
		if (commands.length > 0) {
			if (!commands.includes(message.content.split(' ')[0].split(prefix)[1])) {
				message.channel.send(`:x: Komutunu tam olarak anlayamadım. Yardım almak için **${prefix}help**`);
			}
		} else {
			message.channel.send(':x: Herhangi bir komut bulamadım.');
		}
	}

	return undefined;
});

client.login(process.env.BOT_TOKEN);
