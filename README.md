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
 - ```npm run lint``` (Checks syntax errors with eslint)
 - ```npm run dev``` (Starts the app with nodemon)
 - ```npm start``` (Regular node start script)

## Bot Commands
 - ```play``` (For playing music)
 - ```skip``` (For skipping the current track)
 - ```stop``` (For stopping the track)
 - ```pause``` (For pausing the current track)
 - ```resume``` (For resuming the paused track)
 - ```queue``` (Shows the current queue)
 - ```loop``` (Enables/disables the loop mode)
 - ```volume``` (For adjusting the volume)
 - ```nowplaying``` (Shows the currently playing track)
 - ```source``` (For accessing the source code)
 - ```help``` (Shows all the commands)

## Installation
 - Clone the repository with ```git clone https://github.com/EgeOnder/carvbot-discord.git```
 - Then download all node dependencies with ```npm install```
 - Create a file named ```.env``` inside the repository folder.
 - Enter your environment variables. (__BOT_TOKEN=<token>__ and __GOOGLE_API_KEY=<key>__)
 - When ready, start the bot with ```npm run dev```