const { MessageEmbed } = require('discord.js');
require('dotenv').config();

const prefix = process.env.PREFIX || '-';

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {  
	const helpEmbed = new MessageEmbed()
		.setColor('#00ff00')
		.setTitle('Tüm Komutlar')
		.addFields(
			{ name: `${prefix}play <şarkı>`, value: 'Dilediğin şarkıyı oynatabilirsin.' },
			{ name: `${prefix}skip`, value: 'Çalan şarkıyı atlayabilirsin.' },
			{ name: `${prefix}stop`, value: 'Tüm sıradaki şarkıları iptal edebilirsin.' },
			{ name: `${prefix}pause`, value: 'Çalan şarkıyı duraklatabilirsin.' },
			{ name: `${prefix}resume`, value: 'Duraklatılmış şarkıyı yeniden oynatabilirsin.' },
			{ name: `${prefix}queue`, value: 'Şarkı sırasına bakabilirsin.' },
			{ name: `${prefix}loop`, value: 'Sıradakileri döngüye alabilirsin.' },
			{ name: `${prefix}volume <seviye>`, value: 'Ses seviyesini ayarlayabilirsin.' },
			{ name: `${prefix}nowplaying`, value: 'Çalan şarkıyı görebilirsin.' },
			{ name: `${prefix}source`, value: 'Carvbot\'un kaynak kodlarını görebilirsin.' },
			{ name: `${prefix}help`, value: 'Bu menüyü açabilirsin.' }
        )
		.setTimestamp();

	message.channel.send(helpEmbed);
};

module.exports.help = {
    name: 'help',
    description: 'Bu menüyü açabilirsin.'
};