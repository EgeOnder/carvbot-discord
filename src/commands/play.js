const YouTube = require('simple-youtube-api');
const { handleVideo } = require('../functions/handleVideo');
const { MessageEmbed } = require('discord.js');

const youtube = new YouTube(process.env.GOOGLE_API_KEY);

module.exports.run = async (client, message, args, url, searchString, queue, serverQueue) => {
	const voiceChannel = message.member.voice.channel;
	if (!message.member.voice.channel) {
		const voiceChannelEmbed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle(':x: Bu komutu kullanmak için ses kanalında olmalısınız.')
			.setTimestamp();

		return message.channel.send(voiceChannelEmbed);
	}
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT')) return message.channel.send(':x: Bulunduğun kanala katılmak için yetkim yok!');
	if (!permissions.has('SPEAK')) return message.channel.send(':x: Bulunduğun kanalda konuşmak için yetkim yok!');

	if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
		const playlist = await youtube.getPlaylist(url);
		const videos = await playlist.getVideos();
		for (const video of Object.values(videos)) {
			const video2 = await youtube.getVideoByID(video.id);
			await handleVideo(video2, message, voiceChannel, true);
		}
		message.channel.send(`:white_check_mark: Oynatma listesi **${playlist.title}** sıraya eklendi!`);
		return undefined;
	} else {
		try {
			var video = await youtube.getVideoByID(url);
		} catch (error) {
			try {
				var videos = await youtube.searchVideos(searchString, 1);
				var video = await youtube.getVideoByID(videos[0].id);
			} catch (error) {
				const notFoundEmbed = new MessageEmbed()
					.setColor('#ff0000')
					.setTitle(':x: Arama kriterlerinde bir sonuç bulamadım!')
					.setTimestamp();
			
				return message.channel.send(notFoundEmbed);
			}
		}
		return handleVideo(video, message, voiceChannel, false, queue);
	}
};

module.exports.help = {
	name: 'play',
};
