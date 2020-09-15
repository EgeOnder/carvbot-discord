const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	if (!message.member.voice.channel) return message.channel.send(':x: Bu komutu kullanmak için ses kanalında olmalısınız.');
	if (!serverQueue) return message.channel.send(':x: Zaten bir şey çalmıyor.');
	if (!args[1]) return message.channel.send(`Şu anki ses seviyesi: ${serverQueue.volume}`);
	if (isNaN(args[1])) return message.channel.send(':x: Lütfen geçerli bir değer giriniz.');
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