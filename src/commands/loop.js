const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	if (!message.member.voice.channel) return message.channel.send(':x: Bu komutu kullanmak için ses kanalında olmalısınız.');
	if (!serverQueue) return message.channel.send(':x: Zaten bir şey çalmıyor.');

	serverQueue.loop = !serverQueue.loop;

    const loopEmbed = new MessageEmbed()
        .setColor('#00ff00')
        .setTitle(`:infinity: Loop modu ${serverQueue.loop ? '**AÇILDI**' : '**KAPANDI**'}!`)
        .setTimestamp();

	return message.channel.send(loopEmbed);
};

module.exports.help = {
	name: 'loop',
};