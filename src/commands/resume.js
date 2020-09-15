const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	if (!message.member.voice.channel) return message.channel.send('Bu komutu kullanmak için ses kanalında olmalısınız.');
	if (!serverQueue) return message.channel.send(':x: Zaten bir şey çalmıyor.');
	if (serverQueue.playing) return message.channel.send(':x: Müzik zaten oynatılıyor.');
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