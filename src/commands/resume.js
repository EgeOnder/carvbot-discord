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
	} if (serverQueue.playing) {
		const alreadyPlayingEmbed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(':x: Müzik zaten oynatılıyor.')
			.setTimestamp();

		return message.channel.send(alreadyPlayingEmbed);
	}
	serverQueue.playing = true;
    serverQueue.connection.dispatcher.resume();
    
    const resumeEmbed = new MessageEmbed()
        .setColor('#00ff00')    
        .setTitle(':arrow_forward: Müzik devam ettiriliyor.')
        .setTimestamp();

	message.channel.send(resumeEmbed);
	return undefined;
};

module.exports.help = {
	name: 'resume',
};