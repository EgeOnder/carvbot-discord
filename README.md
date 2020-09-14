# Carvbot Discord
A simple music bot for Discord channels. (Only Turkish)

## Dependencies
 - **discord.js** (Discord integration library)
 - **dotenv** (Handling environment variables)
 - **ytdl-core** (Handling YouTube downloads)
 - **simple-youtube-api** (For fetching data from YouTube)
 - **opusscript** (YTDL-CORE dependency)
 - **nodemon** (For development purposes)
 - **eslint** (For development purposes)

## Scripts
 - ```npm run lint``` (Checking syntax errors with eslint)
 - ```npm run dev``` (Starting the app with nodemon)
 - ```npm start``` (Regular node start script)

## Bot Commands
 - ```oynat``` or ```play``` (For playing music)
 - ```atla``` or ```geç``` or ```skip``` (For skipping the current track)
 - ```durdur``` or ```stop``` (For stopping the track)
 - ```duraklat``` or ```pause``` (For pausing the current track)
 - ```devam``` or ```resume``` (For resuming the paused track)
 - ```sıra``` or ```queue``` (Shows the current queue)
 - ```loop`` (Enables/disables the loop mode)
 - ```ses``` or ```volume``` (For adjusting the volume)
 - ```çalan``` or ```nowplaying``` or ```np``` (Shows the currently playing track)
 - ```prefix``` (For setting the prefix)
 - ```yardım``` or ```help``` (Shows all the commands)