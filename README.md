# Minecraft Speedrun Server
This is a fork of https://github.com/NearW/minecraft-speedrun with more features

This project provides a better startup for a speedrun server as it can automatically:

-   Delete the world folder after stopping the server
-   Rename the world folder after stopping the server to persist previously played worlds
-   Toggleable auto restart server
-   Turn off auto-save to prevent the lag every 5 minutes
-   Move datapacks to the world folder
-   Set the seed from a list of seeds sequentially
-   Load a specific world for All Advancement runs
-   IGT Timer
-   IGT Timer in actionbar
-   Start IGT timer when "start run" is typed in chat

## Prerequisites

-   JRE 8 installed https://www.java.com/download/
-   Node LTS installed https://nodejs.org/en/download/
-   Working Vanilla Minecraft Server
-   `speedrun.json`, `Server.bat`/`Server.sh` and `server.js` downloaded https://github.com/Blueil/minecraft-speedrun/releases/latest

## Usage

-   Put `speedrun.json`, `Server.bat` and `server.js` in the root folder of your minecraft server
-   Edit your `server.properties` and set the following entries:
    -   spawn-protection=0
    -   allow-flight=true
    -   level-name=world

_Note: Enabling flight will prevent random disconnects when traveling too fast via boat, riding a horse or other activities._

-   Edit `speedrun.json` with your desired settings. This is the only downloaded file you should change.

```ts
{
    "MIN_RAM": 8, // Minimum allocated RAM in GB, -Xms
    "MAX_RAM": 10, // Maximum allocated RAM in GB, -Xmx
    "OP": ["Notch"], // List of operators
    "WHITELIST": ["Notch"], // List of whitelisted players
    "DATA_PACK": false, // set to true, if datapacks should be copied into the world
    "SEEDS": ["-9223372036854775808", "9223372036854775807"], // List of set seeds that are played one by one, set [] to disable this option
    "AUTO_SAVE":  false, // Turn off to prevent 5 minute lag, default false
    "KEEP_WORLDS":  false, // Turn on if worlds should be renamed instead of deleted, default false
    "LOAD_WORLD": "world_2021-05-21_15-31-24", // Default: "". Set world folder name that should be loaded on server start instead of deleting/archiving the world.
    "AUTO_RESTART": false, // Turn on to make the server restart when stopped
    "IGT": true, // Turn on to make the server take times when "/time set 0" is done
    "ACTION_BAR_IGT" : true, // Turn on to make the igt time show in the auction bar, IGT must be on for this to work. recommended to use it with ALTERNATIVE_START and without op players
    "ALTERNATIVE_START" : true // Turn on to make the server start the timer and type "/time set 0" when a player type in chat "start run", IGT must be on for this to work. recommended to use when ACTION_BAR_IGT is on
}
```

### Datapacks

In order to automatically add datapacks to your world on each restart, add a folder named `datapacks` to the root of your
minecraft server and put the unzipped datapacks inside and enable it in the `speedrun.json` config.

### Set Seeds

Add seeds to the `SEEDS` list, if you want to restart the world with set seeds. On each restart, the first seed of the list will be loaded and removed from the list.
This is really helpful, if you want to do some speedrun battles with a pool of set seeds.

### All Advancements

Set `AUTO_SAVE` and `KEEP_WORLDS` to `true` while resetting for a good seed. Once a playable seed is found,
set `LOAD_WORLD` to the world folder name of that world to prevent future resets.
