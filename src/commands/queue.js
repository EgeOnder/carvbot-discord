const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	if (!serverQueue) return message.channel.send(':x: Şu anda bir şey çalmıyor.');
	
	const queueEmbed = new MessageEmbed()
		.setColor('#00ff00')
		.addField(':arrow_forward: Sıradaki Parçalar', serverQueue.songs.map(song => `**~** ${song.title}`).join('\n'))
		.addField(':play_pause: Çalan', serverQueue.songs[0].title)
		.setTimestamp();

	message.channel.send(queueEmbed);
	return undefined;
};

module.exports.help = {
	name: 'queue',
};