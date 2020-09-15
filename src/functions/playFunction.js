const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');

function play (guild, song, queue) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	if (!song[0]) {
		const dispatcher = serverQueue.connection.play(ytdl(song.url))
			.on('finish', () => {
				if (serverQueue.songs.length > 1) {
					serverQueue.songs.shift();
				}
				play(guild, serverQueue.songs, queue);
			})
			.on('error', () => {
				console.log(error);
			});

		dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

		const nowPlayingEmbed = new MessageEmbed()
			.setColor('#00ff00')
			.setTitle(':musical_note: Şu anda çalan:')
			.setURL(song.url)
			.addField(`**${song.title}**`, song.url)
			.setTimestamp();
            
		serverQueue.textChannel.send(nowPlayingEmbed);
	} else {
		console.log(song[0]);
		const dispatcher = serverQueue.connection.play(ytdl(song[0].url))
			.on('finish', () => {
				if (!serverQueue.loop) {
					if (serverQueue.songs.length > 1) {
						serverQueue.songs.shift();
					}
				}

				play(guild, serverQueue.songs, queue);
			})
			.on('error', () => {
				console.log(error);
			});

		dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

		const nowPlayingEmbed = new MessageEmbed()
			.setColor('#00ff00')
			.setTitle(':musical_note: Şu anda çalan:')
			.setURL(song[0].url)
			.addField(`**${song[0].title}**`, song[0].url)
			.setTimestamp();
            
		serverQueue.textChannel.send(nowPlayingEmbed);
	}
}

module.exports = {
	play,
};