const { play } = require('../functions/playFunction');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	if (!message.member.voice.channel) return message.channel.send(':x: Bu komutu kullanmak için ses kanalında olmalısınız.');
	if (!serverQueue) return message.channel.send(':x: Zaten bir şey çalmıyor.');
	if (message.member.voice.channel != serverQueue.voiceChannel) return message.channel.send(':x: Bu komutu kullanmak için bot ile aynı kanalda olmalısınız.');
	serverQueue.songs = [];
	play(message.guild, undefined, queue);

	const stopEmbed = new MessageEmbed()
		.setColor('#00ff00')	
		.setTitle(':stop_button: Müzik durduruldu.')
		.setTimestamp();

	message.channel.send(stopEmbed);
	return undefined;
};

module.exports.help = {
	name: 'stop',
};