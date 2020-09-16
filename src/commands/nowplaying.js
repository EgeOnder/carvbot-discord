const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	if (!serverQueue) return message.channel.send(':x: Şu anda bir şey çalmıyor.');
	
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