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
	} if (!args[1]) {
		const argsEmbed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(':x: Sayı girmeniz gerekiyor.')
			.setTimestamp();
		
		return message.channel.send(argsEmbed);
	} if (!serverQueue.songs[args[1] - 1]) {
		const notFoundEmbed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(':x: Şarkı bulunamadı.')
			.setTimestamp();

		return message.channel.send(notFoundEmbed);
	} if (args[1] == 1) {
		const cannotRemove = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(':x: Şu an çalan şarkıyı silemezsiniz.')
			.setTimestamp();

		return message.channel.send(cannotRemove);
	}

	const removeEmbed = new MessageEmbed()
		.setColor('#00ff00')
		.addField(':skull_crossbones: Sıradan Silindi', serverQueue.songs[args[1] - 1].title)
		.setTimestamp();

	serverQueue.songs.splice(args[1] - 1, 1);

	message.channel.send(removeEmbed);
	return undefined;
};

module.exports.help = {
	name: 'remove'
};