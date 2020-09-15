const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
require('dotenv').config();

const client = new Discord.Client({ disableEveryone: true });
const youtube = new YouTube(process.env.GOOGLE_API_KEY);

const queue = new Map();

let prefix = '!';

client.on('ready', () => {
    console.log('Carvbot is ready!');
    client.user.setActivity(`${prefix}yardım`, { type: 'LISTENING' });
    console.log('Status set to LISTENING!');
});

client.on('message', async (message) => {
    console.log('[' + message.author.username + ']: ' + message.content);

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.substring(prefix.length).split(' ');
    const searchString = args.slice(1).join(' ');
    const url = args[1] ? args[1].replace(/<(._)/g, '$1') : '';
    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${prefix}oynat`) ||  message.content.startsWith(`${prefix}play`)) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send(':x: Bu komutu kullanmak için ses kanalında olmalısınız.');
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
                    return message.channel.send(':x: Arama kriterlerinde bir sonuç bulamadım!');
                }
            }
            return handleVideo(video, message, voiceChannel);
        }

    } else if (message.content.startsWith(`${prefix}durdur`) || message.content.startsWith(`${prefix}stop`)) {
        if (!message.member.voice.channel) return message.channel.send(':x: Bu komutu kullanmak için ses kanalında olmalısınız.');
        if (!serverQueue) return message.channel.send(':x: Zaten bir şey çalmıyor.');
        serverQueue.songs = [];
        play(message.guild);
        message.channel.send(':stop_button: Müzik durduruldu.');
        return undefined;
    } else if (message.content.startsWith(`${prefix}atla`) || message.content.startsWith(`${prefix}skip`) || message.content.startsWith(`${prefix}geç`)) {
        if (!message.member.voice.channel) return message.channel.send(':x: Bu komutu kullanmak için ses kanalında olmalısınız.');
        if (!serverQueue) return message.channel.send(':x: Zaten bir şey çalmıyor.');
        if (serverQueue.songs.length == 1 && !serverQueue.loop) {
            serverQueue.songs = [];
            play(message.guild);
            message.channel.send(':play_pause: Şarkı atlandı!');
            return undefined;
        } else {
            serverQueue.connection.dispatcher.end();
            message.channel.send(':play_pause: Şarkı atlandı!');
            return undefined;
        }
    } else if (message.content.startsWith(`${prefix}ses`) || message.content.startsWith(`${prefix}volume`)) {
        if (!message.member.voice.channel) return message.channel.send(':x: Bu komutu kullanmak için ses kanalında olmalısınız.');
        if (!serverQueue) return message.channel.send(':x: Zaten bir şey çalmıyor.');
        if (!args[1]) return message.channel.send(`Şu anki ses seviyesi: ${serverQueue.volume}`);
        if (isNaN(args[1])) return message.channel.send(':x: Lütfen geçerli bir değer giriniz.');
        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
        message.channel.send(`:white_check_mark: Ses, **${args[1]}** seviyesine ayarlandı.`);
        return undefined;
    } else if (message.content.startsWith(`${prefix}çalan`) || message.content.startsWith(`${prefix}nowplaying`) || message.content.startsWith(`${prefix}np`)) {
        if (!serverQueue) return message.channel.send(':x: Şu anda bir şey çalmıyor.');
        message.channel.send(`:white_check_mark: Şu an çalan: **${serverQueue.songs[0].title}**`);
        return undefined;
    } else if (message.content.startsWith(`${prefix}sıra`) || message.content.startsWith(`${prefix}queue`)) {
        if (!serverQueue) return message.channel.send(':x: Zaten bir şey çalmıyor.');
        const queueEmbed = new Discord.MessageEmbed()
            .setColor('#00ff00')
            .addField(':arrow_forward: Sıradaki Parçalar', serverQueue.songs.map(song => `**~** ${song.title}`).join('\n'))
            .addField(':play_pause: Çalan', serverQueue.songs[0].title)
            .setTimestamp();

        message.channel.send(queueEmbed);
        return undefined;
    } else if (message.content.startsWith(`${prefix}duraklat`) || message.content.startsWith(`${prefix}pause`)) {
        if (!message.member.voice.channel) return message.channel.send(':x: Bu komutu kullanmak için ses kanalında olmalısınız.');
        if (!serverQueue) return message.channel.send(':x: Zaten bir şey çalmıyor.');
        if (!serverQueue.playing) return message.channel.send(':x: Müzik zaten duraklatılmış.');
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        message.channel.send(':pause_button: Müzik duraklatıldı.');
        return undefined;
    } else if (message.content.startsWith(`${prefix}devam`) || message.content.startsWith(`${prefix}resume`)) {
        if (!message.member.voice.channel) return message.channel.send('Bu komutu kullanmak için ses kanalında olmalısınız.');
        if (!serverQueue) return message.channel.send(':x: Zaten bir şey çalmıyor.');
        if (serverQueue.playing) return message.channel.send(':x: Müzik zaten oynatılıyor.');
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        message.channel.send(':arrow_forward: Müzik devam ettiriliyor.');
        return undefined;
    } else if (message.content.startsWith(`${prefix}loop`)) {
        if (!message.member.voice.channel) return message.channel.send(':x: Bu komutu kullanmak için ses kanalında olmalısınız.');
        if (!serverQueue) return message.channel.send(':x: Zaten bir şey çalmıyor.');

        serverQueue.loop = !serverQueue.loop;

        return message.channel.send(`Loop modu şu anda: ${serverQueue.loop ? `**AÇIK**` : `**KAPALI**`}`);
    } else if (message.content.startsWith(`${prefix}prefix`)) {
        if (!args[1]) return message.channel.send(':x: Lütfen geçerli bir yeni değer giriniz.');
        
        prefix = args[1].toString();
        message.channel.send(`:white_check_mark: Yeni prefix **${args[1]}** olarak ayarlandı!`);
    } else if (message.content.startsWith(`${prefix}kaynak`) || message.content.startsWith(`${prefix}source`)) {
        const sourceCodeEmbed = new Discord.MessageEmbed()
            .setColor('#00ff00')
            .addField('**Kaynak Kodu**', 'https://ege.works/carvbot-discord')
            .setTimestamp();

        message.channel.send(sourceCodeEmbed);
    } else if (message.content.startsWith(`${prefix}yardım`) || message.content.startsWith(`${prefix}help`)) {
        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#00ff00')
            .setTitle('Tüm Komutlar')
            .addFields(
                { name: `${prefix}oynat <şarkı>`, value: 'Dilediğin şarkıyı oynatabilirsin.' },
                { name: `${prefix}atla`, value: 'Çalan şarkıyı atlayabilirsin.' },
                { name: `${prefix}durdur`, value: 'Tüm sıradaki şarkıları iptal edebilirsin.' },
                { name: `${prefix}duraklat`, value: 'Çalan şarkıyı duraklatabilirsin.' },
                { name: `${prefix}devam`, value: 'Duraklatılmış şarkıyı yeniden oynatabilirsin.' },
                { name: `${prefix}sıra`, value: 'Şarkı sırasına bakabilirsin.' },
                { name: `${prefix}loop`, value: 'Sıradakileri döngüye alabilirsin.' },
                { name: `${prefix}ses <seviye>`, value: 'Ses seviyesini ayarlayabilirsin.' },
                { name: `${prefix}çalan`, value: 'Çalan şarkıyı görebilirsin.' },
                { name: `${prefix}prefix <yeni prefix>`, value: 'Carvbot\'un prefixini ayarlayabilirsin.' },
                { name: `${prefix}yardım`, value: 'Bu menüyü açabilirsin.' }
            )
            .setTimestamp()

        message.channel.send(helpEmbed);
    } else {
        message.channel.send(`:x: Komutunu tam olarak anlayamadım. Yardım almak için **${prefix}yardım**`);
    }

    return undefined;
});

async function handleVideo(video, message, voiceChannel, playlist = false) {
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
            play(message.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.log(`There was an error connecting to the voice channel: ${error}`);
            queue.delete(message.guild.id);
            return message.channel.send(`:x: Kanala katılırken bir hata oluştu: ${error}`);
        }
    } else {
        serverQueue.songs.push(song);
        if (playlist) return undefined;
        else {
            const queueAddedEmbed = new Discord.MessageEmbed()
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

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    if (!song[0]) {
        console.log(serverQueue.songs.length);
        const dispatcher = serverQueue.connection.play(ytdl(song.url))
            .on('finish', () => {
                if (serverQueue.songs.length > 1) {
                    serverQueue.songs.shift();
                }
                play(guild, serverQueue.songs);
            })
            .on('error', () => {
                console.log(error);
            });

        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

        const nowPlayingEmbed = new Discord.MessageEmbed()
            .setColor('#00ff00')
            .setTitle(':musical_note: Şu anda çalan:')
            .setURL(song.url)
            .addField(`**${song.title}**`, song.url)
            .setTimestamp();
            
        serverQueue.textChannel.send(nowPlayingEmbed)
    } else {
        console.log(song[0]);
        const dispatcher = serverQueue.connection.play(ytdl(song[0].url))
            .on('finish', () => {
                if (!serverQueue.loop) {
                    if (serverQueue.songs.length > 1) {
                        serverQueue.songs.shift();
                    }
                }

                play(guild, serverQueue.songs);
            })
            .on('error', () => {
                console.log(error);
            });

        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

        const nowPlayingEmbed = new Discord.MessageEmbed()
            .setColor('#00ff00')
            .setTitle(':musical_note: Şu anda çalan:')
            .setURL(song[0].url)
            .addField(`**${song[0].title}**`, song[0].url)
            .setTimestamp();
            
        serverQueue.textChannel.send(nowPlayingEmbed)
    }
}

client.login(process.env.BOT_TOKEN);
