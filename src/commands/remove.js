const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	if (!serverQueue) return message.channel.send(':x: Şu anda bir şey çalmıyor.');
	if (!args[1]) return message.channel.send(':x: Sayı girmeniz gerekiyor.');
	if (!serverQueue.songs[args[1] - 1]) return message.channel.send(':x: Şarkı bulunamadı.');
	if (args[1] == 1) return message.channel.send(':x: Şu an çalan şarkıyı silemezsiniz.');

	const removeEmbed = new MessageEmbed()
		.setColor('#00ff00')
		.addField(':skull_crossbones: Sıradan Silindi', serverQueue.songs[args[1] - 1].title)
		.setTimestamp();

	serverQueue.songs.splice(args[1] - 1, 1);

	message.channel.send(removeEmbed);
	return undefined;
};

module.exports.help = {
	name: 'remove',
};