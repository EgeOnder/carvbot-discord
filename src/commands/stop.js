const { play } = require('../functions/playFunction');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	if (!message.member.voice.channel) {
		const voiceChannelEmbed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(':x: Bu komutu kullanmak için ses kanalında olmalısınız.')
			.setTimestamp();

		return message.channel.send(voiceChannelEmbed);
	} if (!serverQueue) {
		const noSongsEmbed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(':x: Zaten bir şarkı çalmıyor.')
			.setTimestamp();

		return message.channel.send(noSongsEmbed);
	} if (message.member.voice.channel != serverQueue.voiceChannel) {
		const botChannelEmbed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(':x: Bu komutu kullanmak için bot ile aynı kanalda olmalısınız.')
			.setTimestamp();
		
		return message.channel.send(botChannelEmbed);
	}
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