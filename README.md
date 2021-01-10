# Minecraft Speedrun Server

This project provides a better startup for a speedrun server as it automatically:

-   Deletes the world folder after stopping the server
-   Restarts the server
-   Turns off auto-save to prevent the lag every 5 minutes
-   Moves datapacks to the world folder **(optional)**
-   Sets the seed from a list of seeds sequentially **(optional)**

## Prerequisites

-   JRE 8 installed https://www.java.com/download/
-   Node LTS installed https://nodejs.org/en/download/

## Usage

-   Move `Start.bat`, `speedrun.json` and `server.js` to the server folder
-   Update the `speedrun.json` with the desired settings
-   Execute `Start.bat` to launch your server
-   If you want to enable datapacks, simply put them in a folder named `datapacks` inside the root folder and enable it in `speedrun.json`
-   If you want to enable setseeds, simply put them in the `speedrun.json`. It will remove one seed from the list on each restart and create a map with that seed.

## Disclaimer

This only works on Windows servers.

With this setup entering commands directly to the terminal is not possible anymore.
Please set the operators name in the configuration, so that one player can use the in-game
commands to add all players to the whitelist.
