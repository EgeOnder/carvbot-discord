const { play } = require('../functions/playFunction');

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
	} if (serverQueue.songs.length == 1 && !serverQueue.loop) {
		serverQueue.songs = [];
		play(message.guild, undefined, queue);
		message.channel.send(':play_pause: Şarkı atlandı!');
		return undefined;
	} else {
		serverQueue.connection.dispatcher.end();
		message.channel.send(':play_pause: Şarkı atlandı!');
		return undefined;
	}
};

module.exports.help = {
	name: 'skip',
};