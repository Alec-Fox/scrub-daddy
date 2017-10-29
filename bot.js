var Discord = require('discord.js');
var inspect = require('util-inspect');
var get = require('lodash.get');
var fs = require('fs');

var c = require('./const.js');
var dnb = require('./dnb.js');
var util = require('./utilities.js');
var gambling = require('./gambling.js');
var games = require('./games.js');
var vote = require('./vote.js');

var auth = require('./secureAuth.json'); 
var client = new Discord.Client();
client.login(auth.token);

var botSpam = {};
var scrubsChannel = {};
var purgatory = {};
var feedbackCategory = {};
var scrubIDtoNick = {};

/**
 * Listen's for messages in Discord
 */
client.on('message', message => {
	console.log(message.content.substring(0, 1));
    //Scrub Daddy will listen for messages that will start with `!`
    if (message.content.substring(0, 1) == '~') {
		const args = message.content.substring(1).match(/\S+/g);
		const cmd = args[0];
		const channelID = message.channel.id;
		const userID = message.member.id;
		const user = message.member.displayName;

		//stops if the message is not from bot-spam text channel, with the exception of the message !p.
		if (channelID !== c.BOT_SPAM_CHANNEL_ID && !(channelID === c.SCRUBS_CHANNEL_ID && cmd === 'p')) {
			return;
		}

		console.log('<CMD> ' + util.getTimestamp() + '  ' + cmd + ' called');	
        switch(cmd) {
			case 'dropScrub':
				dnb.maybeDischargeScrubBubble();
				break;
			case 'createSquad':
				dnb.createSquad(userID);
				break;
			case 'addToSquad':
				dnb.addToSquad(userID, args);
				break;
			case 'getSquads':
				dnb.getSquads(userID);
				break;
			case 'getSquad':
				dnb.getSquad(userID, args);
				break;
			case 'getUnsquaded':
				dnb.getUnsquaded(userID);
				break;
			case 'deleteSquad':
				dnb.deleteSquad(userID, args);
				break;
			case 'removeFromSquad':
				dnb.removeFromSquad(userID, args);
				break;
			case 'dismissScrub':
				dnb.dismissScrub(userID, args);
				break;
			case 'ranks':
				gambling.armyRanks();
				break;
			case 'catfacts':
				util.catfacts();
			case 'issue':
				util.submitIssue(user, args, message);
				break;
			case 'export':
				gambling.exportLedger();
				games.exportTimeSheet();
				break;
			case 'catfacts':
				util.catfacts();
				break;
			case 'army':
				gambling.army(userID, args);
				break;
			case 'rank':
			case 'ranks':
				gambling.armyRanks();
				break;
			case 'clean':
				//PRIORITIZE ADDING NICKNAMES VIA GETSCRUBS SO YOU CAN RESPOND TO BETS WITH NICKNAMES
				c.BOT.sendMessage({
					to: c.BOT_SPAM_CHANNEL_ID,
					embed:  {
						color: 0xffff00,
						title: "This functionality has been disabled! Please wait patiently until the full game is finished!",
						image: {
							url: c.BUBBLE_IMAGES[1]
						}
					} 
				});
				gambling.maybeBetClean(userID, args);
				break;
			case 'revive':
				userID = 'dev';
			case 'discharge':
				gambling.dischargeScrubBubble(userID);
				break;
			case 'enlist':
				dnb.enlist(userID);
				break;
			case 'p':
				games.askToPlayPUBG();
				break;
			case 'playing':
				games.getAndOutputCountOfGamesBeingPlayed(message.guild.members.array());
				break;
			case 'gameHistory':
				games.maybeOutputGameHistory();
				break;
			case 'time':
				games.maybeOutputTimePlayed(args);
				break;
			case 'opt-in':
				games.optIn(user, userID);
				break;
			//custom vote
			case 'vote':
				vote.conductVote(user, userID, channelID, args, c.VOTE_TYPE.CUSTOM);			
				break;
			case 'votekick':
				console.log('<VOTE Kick> ' + util.getTimestamp() + '  ' + user + ': ' + message);
				vote.conductVote(user, userID, channelID, args, c.VOTE_TYPE.KICK, message.member.voiceChannel, message.guild.roles);
				break;
			case 'voteban':
				console.log('<VOTE Ban> ' + util.getTimestamp() + '  ' + user + ': ' + message);			
				vote.conductVote(user, userID, channelID, args, c.VOTE_TYPE.BAN, message.member.voiceChannel, message.guild.roles);
				break;
			//get custom vote totals or number of kick/ban votes for a user
			case 'voteinfo':
				if (!args[1]) {
					console.log('<VOTE Info Custom> ' + util.getTimestamp() + '  ' + user + ': ' + message);								
					vote.getCustomVoteTotals();
				} else {
					console.log('<VOTE Info User> ' + util.getTimestamp() + '  ' + user + ': ' + message);													
					vote.getTotalVotesForTarget(user, message.member.voiceChannel, channelID, args);
				}	
				break;
			case 'help':
			case 'info':
			case 'helpinfo':
				util.sendEmbedFieldsMessage('Voting', c.HELP_VOTING);
				util.sendEmbedFieldsMessage('Scrubbing Bubbles', c.HELP_SCRUBBING_BUBBLES);
				util.sendEmbedFieldsMessage('Time Played', c.HELP_TIME_PLAYED);
				util.sendEmbedFieldsMessage('Player Count', c.HELP_PLAYER_COUNT);
				util.sendEmbedFieldsMessage('Bot Issues, Feature Requests, and Help', c.HELP_BOT);
				util.sendEmbedFieldsMessage('Miscellaneous', c.HELP_MISC);
		 }
	 } else if (isArrivedForDutyMessage(message)) {
		gambling.maybeDeletePreviousMessage(message);
	}
});

/**
 * listens for updates to a user's presence (online status, game, etc).
 */
client.on('presenceUpdate', (oldMember, newMember) => { 
	games.updateTimesheet(newMember.displayName, newMember.id, get(oldMember, 'presence.activity.name'), get(newMember, 'presence.activity.name'));
	//gambling.maybeDischargeScrubBubble(botSpam);
});

/**
 * Reconnects the bot if diconnected.
 */
client.on('disconnect', event => {
	c.LOG.error('<ERROR> ' +  util.getTimestamp() + '  event: ' + inspect(event));
	client.login(auth.token);
});

/**
 * Logs the bot into Discord, stores id to nick map, and retrieves 3 crucial channels.
 */
client.on('ready', () => {
	console.log('<INFO> ' + util.getTimestamp() + '  Connected');
	
	const members = client.guilds.find('id', c.SERVER_ID).members;
	members.forEach((member) => {
		scrubIDtoNick[member.id] = member.displayName;
	});

	botSpam = client.channels.find('id', c.BOT_SPAM_CHANNEL_ID);	
	scrubsChannel = client.channels.find('id', c.SCRUBS_CHANNEL_ID);
	purgatory = client.channels.find('id', c.PURGATORY_CHANNEL_ID);
	feedbackCategory = client.channels.find('id', c.FEEDBACK_CATEGORY_ID);		
});

function isArrivedForDutyMessage(message) {
    return message.member.id === c.SCRUB_DADDY_ID && get (message, 'embeds[0].title') && message.embeds[0].title.indexOf('duty') !== -1 && message.channel.id === c.BOT_SPAM_CHANNEL_ID;
}

exports.getBotSpam = () => botSpam;
exports.getScrubsChannel = () => scrubsChannel;
exports.getPurgatory = () => purgatory;
exports.getScrubIDToNick = () => scrubIDtoNick;
exports.getFeedbackCategory = () => feedbackCategory;
exports.getClient = () => client;

