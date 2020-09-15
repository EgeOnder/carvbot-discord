const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	if (!message.member.voice.channel) return message.channel.send(':x: Bu komutu kullanmak için ses kanalında olmalısınız.');
	if (!serverQueue) return message.channel.send(':x: Zaten bir şey çalmıyor.');
	if (!serverQueue.playing) return message.channel.send(':x: Müzik zaten duraklatılmış.');
	serverQueue.playing = false;
    serverQueue.connection.dispatcher.pause();
    
	const pauseEmbed = new MessageEmbed()
        .setColor('#00ff00')    
        .setTitle(':pause_button: Müzik duraklatılıyor.')
        .setTimestamp();
        
	message.channel.send(pauseEmbed);
	return undefined;
};

module.exports.help = {
	name: 'pause',
};