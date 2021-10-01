# twitch_banbot

This is just a simple bot joining configured channels and reacting to commands.

## prereq

- Make an account on Twitch (for your bot) or use the one you stream with.
- Request an oauth code on https://twitchapps.com/tmi/. You'll need to login and give the app permissions to generate it for you. 
- Register your app with Twitch dev at https://dev.twitch.tv/console/apps/create and request a client-id (so you can interface with Twitch's API)


## how to use

Make changes to `.env` and `config.json`. These files will be read by the main script `commandblock.js` in order to get a list of accounts to be banned and channels to join.

Run `docker build -t <tag> .` to create a docker image or run the following commands to run the bot locally:
- `npm install dotenv tmi.js sleep console-stamp --save`
- `node commandblock.js`

In order to ban accounts from the list, the configured bot account (in `.env`) needs to have the `/mod` role on the target channel.
The commands can also only be executed by the broadcaster (owner) or a user with mod role.
If regulars execute the command the bot will do nothing.

## commands

- `!banrun (opt: info)`: will show a short help text
- `!banrun start`: will start processing the ban list

## updating the blocklist

Just add new entries to the `config.json` file (bans and channels) and re-run.


## source

- https://github.com/tmijs/tmi.js#readme
