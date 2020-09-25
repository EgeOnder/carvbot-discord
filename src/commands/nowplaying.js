const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	if (!serverQueue) {
		const noSongsEmbed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(':x: Zaten bir şarkı çalmıyor.')
			.setTimestamp();

		return message.channel.send(noSongsEmbed);
	}
	
	const nowPlayingEmbed = new MessageEmbed()
		.setColor('#00ff00')
		.setTitle(':musical_note: Şu anda çalan:')
		.setURL(serverQueue.songs[0].url)
		.addField(`**${serverQueue.songs[0].title}**`, serverQueue.songs[0].url)
		.setTimestamp();

	message.channel.send(nowPlayingEmbed);
	return undefined;
};

module.exports.help = {
	name: 'nowplaying',
};