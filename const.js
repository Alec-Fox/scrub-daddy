var util = require('./utilities.js');
var auth = require('./secureAuth.json'); 
var get = require('lodash.get');

function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}

define('LOG', require('winston'));
define('LOOP_DELAY', 1500);							        //delay between each loop
define('BOT_SPAM_CHANNEL_ID', '372570540482887701');		//listen's to messages from this channel
define('SCRUBS_CHANNEL_ID', '370626384059695107');		    //channel ID of scrubs text channel
define('SERVER_ID', auth.serverID);				    		//Bed Bath Server ID
define('CATEGORY_ID', {
	'Issue': '372143355070644255', 
	'Feature': '374009714213781504',
	'Temp': '374246719648694282'
});
define('DAYS', ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']);
define('PUBG_ALIASES', ['scrubg', 'pubg', 'pugG', 'pabg', 'pobg', 'pebg', 'pibg', 'pybg', 'Mr. Pib G.', 'pub', 'pudgy', 'puh ba gee']);
define('GREETINGS', ['you guys', 'yous guys', 'y\'all', 'hey buddies,', 'hey pals,', 'hey friends,', 'sup dudes,', 'hello fellow humans,']);
define('BOT_IDS', ['172002275412279296', '86920406476292096', '188064764008726528', '263059218104320000', '116275390695079945', '362784198848675842']);
define('GAME_NAME_TO_IMG', {
    'World of Warcraft' : 'http://i.imgur.com/US59X7X.jpg', 
    'Overwatch' : 'http://i.imgur.com/WRQsSYp.png', 
    'PUBG' : 'https://i.imgur.com/nT2CNCs.png', 
    'Fortnite' : 'https://i.imgur.com/S0CN7n9.jpg'
});
define('THUMBS_UP_GIF', 'https://i.imgur.com/CLC53gf.gif');
define('CLEAN_WIN_IMG', 'https://i.imgur.com/LDSm2sg.png');
define('CLEAN_LOSE_IMG', 'https://i.imgur.com/gynZE1j.png');
define('SCRUB_DADDY_FACT', 'https://i.imgur.com/FbAwRTj.jpg');
define('PURGATORY_CHANNEL_ID', '370626266786824192');	    //sends kicked user's to this channel    
define('VOTE_TYPE', {
	KICK : 'kick',
	BAN : 'ban',
	PTT : 'force Push To Talk',
	REMOVE_ROLE : 'remove role',
	CUSTOM : 'custom'
});
define('CHANNEL_ID_TO_BAN_ROLE_ID',{
	'370625207150575617' : '370746310346801164',	        //Beyond
	'370625515293507584' : '370747862302326785',	        //Str8 Chillin
	'370625345138720809' : '370747704621662218',	        //D. Va licious
	'370626021227233290' : '370748388578295808',	        //Spazzy's Scrub Shack
	'370625671833190400' : '370747928400232448',	        //Cartoon Network
	'370625623736975372' : '370748471835230209',	        //The League
	'370626139972042752' : '370747759130705922',	        //They'll fix that b4 release
});
define('BUBBLE_IMAGES', ['https://i.imgur.com/rddtZR6.png','https://i.imgur.com/MdKfKVG.png','https://i.imgur.com/ZAyLJSJ.png','https://i.imgur.com/K6k4b3q.png','https://i.imgur.com/m7V6BEa.png',
						 'https://i.imgur.com/Q7JO7Fn.png','https://i.imgur.com/lXZNXoz.png','https://i.imgur.com/xdwTSuG.png','https://i.imgur.com/PE99BJ8.png','https://i.imgur.com/VhFgbRQ.png',
						 'https://i.imgur.com/hQvbZkP.png','https://i.imgur.com/LLdxaj4.png','https://i.imgur.com/cCiI4CE.png','https://i.imgur.com/fue3AAM.png','https://i.imgur.com/8cah0Ar.png',
						 'https://i.imgur.com/3bXFEcL.png','https://i.imgur.com/Q33oITR.png','https://i.imgur.com/O2iQuhP.png','https://i.imgur.com/LUq3M1Q.png','https://i.imgur.com/ne412gl.png',
						 'https://i.imgur.com/ASgP6i6.png']);
define('SCRUB_DADDY_ID', '370688149971795982');
define('HELP_VOTING',[{ name: 'Please Note', value: '`You must be in a voice channel with at least 3 members to participate in a kick/ban vote.`', inline: 'false'},
					  { name: '!votekick <`@user`>', value: '`to remove user from channel.`', inline: 'false'},
					  { name: '!voteban <`@user`>', value: '`for a more permanent solution.`', inline: 'false'},
					  { name: '!vote <`thing to vote for`>', value: '`to do a custom vote.`', inline: 'false'},
					  { name: '!voteinfo', value: '`for totals of all custom votes.`', inline: 'false'},
					  { name: '!voteinfo <`@user`>', value: '`for total votes to kick/ban that user.`', inline: 'false'}]);
					
define('HELP_SCRUBBING_BUBBLES',[{ name: '!enlist', value: '`enlists the discharged Scrubbing Bubbles to your army.`', inline: 'false'},
								 { name: '!discharge', value: '`honorably discharges a Scrubbing Bubble from your army.`', inline: 'false'},
								 { name: '!clean <`numBubbles`> <`t|b`>', value: '`send numBubbles to clean toilet/bath.`', inline: 'false'},
								 { name: '!army', value: '`retrieves the size of your army`', inline: 'false'},
								 { name: '!army <`@user`>', value: '`retrieves the size of the user\'s army`', inline: 'false'}]);
define('HELP_TIME_PLAYED',[{ name: '!time <`Game Name`> <`@user`>', value: '`user\'s playtime for the specified Game Name.`', inline: 'false'},
						   { name: '!time <`Game Name`>', value: '`cumulative playtime for the specified Game Name.`', inline: 'false'},
						   { name: '!time <`@user`>', value: '`user\'s playtime for all games.`', inline: 'false'},
						   { name: '!time', value: '`cumulative playtime for all games.`', inline: 'false'},
						   { name: '!opt-in', value: '`to opt into playtime tracking.`', inline: 'false'}]);

define('HELP_PLAYER_COUNT',[{ name: '!playing', value: '`player count of games currently being played.`', inline: 'false'},
							{ name: '!gameHistory', value: '`player counts for all games throughout the day.`', inline: 'false'}]);

define('HELP_BOT',[{ name: 'Please Note', value: '`Your issue title or feature title must be ONE WORD! msg is optional`', inline: 'false'},
				   { name: '!issue <`issue-title`> <`msg detailing issue`>', value: '`to submit bot issues.`', inline: 'false'},
				   { name: '!feature <`feature-title`> <`msg detailing feature`>', value: '`to submit bot feature requests.`', inline: 'false'},
				   { name: '!help, !info, or !helpinfo', value: '`to show this message again.`', inline: 'false'}]);
				   
define('HELP_MISC',[{ name: '!p', value: '`to ask @Scrubs to play PUBG in scrubs text channel.`', inline: 'false'},
					{ name: '!temp', value: '`Creates a temporary text channel`', inline: 'false'},
					{ name: '!temp <`text|voice`>', value: '`Creates a temp text/voice channel`', inline: 'false'},
					{ name: '!temp <`text|voice`> <`channel-title`>', value: '`Creates a voice/text channel with the provided title`', inline: 'false'}]);
define('HELP_CATEGORIES_PROMPT',[{ name: 'To select a category:', value: '`Type one of the numbers below.`', inline: 'false'},
						  { name: '1) Voting', value: '`votekick`	`voteban`	`vote`	`voteinfo`', inline: 'false'},
						  { name: '2) Scrubbing Bubbles', value: '`enlist`	`discharge`	`clean`	`army`', inline: 'false'},
						  { name: '3) Time Played', value: '`time`	`opt-in`', inline: 'false'},
						  { name: '4) Player Count', value: '`playing`	`gameHistory`', inline: 'false'},
						  { name: '5) Bot Issues, Feature Requests, and Help', value: '`issue`	`feature`	`help`	`info`	`helpinfo`', inline: 'false'},
						  { name: '6) Miscellaneous', value: '`p`	`temp`', inline: 'false'}]);
define('HELP_CATEGORIES', [{name: '`Voting`', fields: exports.HELP_VOTING},
{name: '`Scrubbing Bubbles`', fields: exports.HELP_SCRUBBING_BUBBLES},
{name: '`Time Played`', fields: exports.HELP_TIME_PLAYED},
{name: '`Player Count`', fields: exports.HELP_PLAYER_COUNT},
{name: '`Bot Issues, Feature Requests, and Help`', fields: exports.HELP_BOT}, 
{name: '`Miscellaneous`', fields: exports.HELP_MISC}]);
