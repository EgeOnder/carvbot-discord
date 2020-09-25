const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	if (!message.member.voice.channel) {
		const voiceChannelEmbed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(':x: Bu komutu kullanmak için ses kanalında olmalısınız.')
			.setTimestamp();

		return message.channel.send(voiceChannelEmbed);
	} if (!serverQueue) {
		const noSongsEmbed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(':x: Zaten bir şarkı çalmıyor.')
			.setTimestamp();

		return message.channel.send(noSongsEmbed);
	} if (message.member.voice.channel != serverQueue.voiceChannel) {
		const botChannelEmbed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(':x: Bu komutu kullanmak için bot ile aynı kanalda olmalısınız.')
			.setTimestamp();
		
		return message.channel.send(botChannelEmbed);
	} if (!serverQueue.playing) {
		const alreadyPausedEmbed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(':x: Müzik zaten duraklatılmış.')
			.setTimestamp();

		return message.channel.send(alreadyPausedEmbed);
	}
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