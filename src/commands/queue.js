const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	if (!serverQueue) {
		const noSongsEmbed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(':x: Zaten bir şarkı çalmıyor.')
			.setTimestamp();

		return message.channel.send(noSongsEmbed);
	}
	
	const queueEmbed = new MessageEmbed()
		.setColor('#00ff00')
		.addField(':arrow_forward: Sıradaki Parçalar', serverQueue.songs.map(song => `**${(serverQueue.songs.indexOf(song) + 1)}.** ${song.title}`).join('\n'))
		.addField(':play_pause: Çalan', serverQueue.songs[0].title)
		.setTimestamp();

	message.channel.send(queueEmbed);
	return undefined;
};

module.exports.help = {
	name: 'queue',
};