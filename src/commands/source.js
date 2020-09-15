const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	const sourceCodeEmbed = new MessageEmbed()
		.setColor('#00ff00')
		.addField('**Kaynak Kodu**', 'https://ege.works/carvbot-discord')
		.setTimestamp();

	message.channel.send(sourceCodeEmbed);
};

module.exports.help = {
	name: 'source',
};