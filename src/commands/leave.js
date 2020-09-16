const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	if (!message.member.voice.channel) return message.channel.send(':x: Bu komutu kullanmak için ses kanalında olmalısınız.');
	if (!serverQueue) return message.channel.send(':x: Zaten bir şarkı çalmıyor.');
	if (message.member.voice.channel != serverQueue.voiceChannel) return message.channel.send(':x: Bu komutu kullanmak için bot ile aynı kanalda olmalısınız.');
	serverQueue.songs = [];
	serverQueue.voiceChannel.leave();
	queue.delete(message.guild.id);

	const stopEmbed = new MessageEmbed()
		.setColor('#00ff00')	
		.setTitle(':octagonal_sign: Müzik kanalından çıkıldı.')
		.setTimestamp();

	message.channel.send(stopEmbed);
	return undefined;
};

module.exports.help = {
	name: 'leave',
};
