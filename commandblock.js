// make the variables inside the .env element available
require('dotenv').config();

// show timestamps in console logs
require('console-stamp')(console, '[HH:MM:ss]');

var sleep = require('sleep');
const config = require('./config.json');
const tmi = require('tmi.js');

// read the users to be banned and remove duplicates
const banning = Array.from(new Set(config.blockers)).sort()

// set the age of the banlist according to file date
const fAge = require('fs').statSync('./config.json').mtime.toDateString()

// create the client
const client = new tmi.Client({
    options: { debug: false, messagesLogLevel: "info" },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: `${process.env.TWITCH_USERNAME}`,
        password: `oauth:${process.env.TWITCH_OAUTH}`
    },
    channels: config.channels
});

console.info("connecting.");
client.connect().catch(console.error);

// a wild chat message appears
client.on('chat', (channel, tags, message, self) => {
    // no need to react to own chat or msg without !banrun at beginning
    if(self && !message.startsWith('!banrun')) return;

    // parse the message for args
    const args = message.slice(1).split(' ');
    const command = args.shift().toLowerCase();

    // check if the bot is mod
    const botUserState = client.userstate[channel];
    const botMod = botUserState !== undefined && botUserState.mod === true;

    // check if the message author is mod/bc
    const badges = tags.badges || {};
    const isBroadcaster = badges.broadcaster;
    const isMod = badges.moderator;
    const userisMod = isBroadcaster || isMod;

    if(!userisMod) return; // no need to react to chat if user has no mod rights

    if(command === 'banrun') {
        console.info(channel + ": command banrun has been triggered.");
        if (args.length == 0 || args[0] === 'info' || !(args[0] === 'start') ) {
            client.action(channel, "Info: moderators or broadcaster can use !banrun start if this bot is added to mods. ban list date is " + fAge + ". Please contact https://twitch.tv/andi242 if questions.")
        }
        if (args[0] === 'start'){
            if(botMod) {
                console.info(channel + ": bot is mod and running banrun.");
                client.action(channel, "starting ban run. ban list date: " + fAge + ".");

                // loop the array of accs to be banned
                banning.forEach(ban => {
                    console.info(channel + ": banning " + ban);
                    client.say(channel, '/ban ' + ban + ' bots be banned by bots.');
                    // sleep 600ms to avoid rate limits
                    sleep.msleep(600);
                });
                client.action(channel, "completed run.");
            } else {
                client.action(channel, "does not have mod rights. doing nothing.");
                console.info(channel + ": sorry, bot is not mod.");
            }
        }
    }
});