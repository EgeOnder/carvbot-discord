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
	if (!args[1]) {
		const currentVolumeEmbed = new MessageEmbed()
			.setColor('#00ff00')
			.setTitle(`Şu anki ses seviyesi: ${serverQueue.volume}`)
			.setTimestamp();

		return message.channel.send(currentVolumeEmbed);
	}
	if (isNaN(args[1])) {
		const invalidValueEmbed = new MessageEmbed()
			.setColor('#00ff00')
			.setTitle(':x: Lütfen geçerli bir değer giriniz.')
			.setTimestamp();

		return message.channel.send(invalidValueEmbed);
	}
	serverQueue.volume = args[1];
	serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);

	const volumeEmbed = new MessageEmbed()
		.setColor('#00ff00')
		.setTitle(`:white_check_mark: Ses, **${args[1]}** seviyesine ayarlandı.`)
		.setTimestamp();
		
	message.channel.send(volumeEmbed);
	return undefined;
};

module.exports.help = {
	name: 'volume',
};