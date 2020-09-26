const { MessageEmbed } = require('discord.js');
const { getSong } = require('genius-lyrics-api');
require('dotenv').config();

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	if (!searchString) {
		const argNotSpecifiedEmbed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(':x: Geçerli bir şarkı adı girin.')
			.setTimestamp();

		return message.channel.send(argNotSpecifiedEmbed);
	}

	const options = {
		apiKey: process.env.GENIUS_API_KEY,
		title: searchString,
		artist: '',
		optimizeQuery: true
	};

	try {
		getSong(options).then((song) => {
			if (song.lyrics >= 2048) {
				const tooLongEmbed = new MessageEmbed()
					.setColor('#ff0000')
					.setTitle(':x: Şarkı sözü çok uzun olduğundan alınamadı.')
					.setTimestamp();

				return message.channel.send(tooLongEmbed);
			}

			const lyricsEmbed = new MessageEmbed()
				.setColor('#00ff00')
				.setTitle('Şarkı Sözleri')
				.setURL(song.url)
				.setThumbnail(song.albumArt)
				.setDescription(song.lyrics)
				.setTimestamp();

			return message.channel.send(lyricsEmbed);
		});
	} catch (error) {
		console.error(error);
		message.channel.send(':x: Şarkı sözü alınırken hata oluştu.');
	}
};

module.exports.help = {
	name: 'lyrics',
};