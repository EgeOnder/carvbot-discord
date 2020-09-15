const { MessageEmbed } = require('discord.js');
const { play } = require('./playFunction');

async function handleVideo(video, message, voiceChannel, playlist = false, queue) {
	const serverQueue = queue.get(message.guild.id);
	
	const song = {
		id: video.id,
		title: video.title,
		url: `https://youtube.com/watch?v=${video.id}`
	};
	
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
			loop: false,
		};
	
		queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);
		
		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0], queue);
		} catch (error) {
			console.log(`There was an error connecting to the voice channel: ${error}`);
			queue.delete(message.guild.id);
			return message.channel.send(`:x: Kanala katılırken bir hata oluştu: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		if (playlist) return undefined;
		else {
			const queueAddedEmbed = new MessageEmbed()
				.setColor('#00ff00')
				.setTitle(':arrow_forward: Sıraya eklendi:')
				.setURL(song.url)
				.addField(`**${song.title}**`, song.url)
				.setTimestamp();
	
			return message.channel.send(queueAddedEmbed);
		}
	}
	
	return undefined;
}

module.exports = {
	handleVideo,
};