const { play } = require('../functions/playFunction');

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	if (!message.member.voice.channel) return message.channel.send(':x: Bu komutu kullanmak için ses kanalında olmalısınız.');
	if (!serverQueue) return message.channel.send(':x: Zaten bir şey çalmıyor.');
	serverQueue.songs = [];
	play(message.guild, undefined, queue);
	message.channel.send(':stop_button: Müzik durduruldu.');
	return undefined;
};

module.exports.help = {
	name: 'stop',
};