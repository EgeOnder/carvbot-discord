const { play } = require('../functions/playFunction');

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	if (!message.member.voice.channel) return message.channel.send(':x: Bu komutu kullanmak için ses kanalında olmalısınız.');
	if (!serverQueue) return message.channel.send(':x: Zaten bir şey çalmıyor.');
	if (serverQueue.songs.length == 1 && !serverQueue.loop) {
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