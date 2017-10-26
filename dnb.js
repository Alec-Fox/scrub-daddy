/*
 *Dungeons and Bathrooms
 *Control armies of scubbing bubbles and clean up bathrooms
 *The game sounded cooler in my head
 */

//import { ScrubBubble } from './ScrubBubble.js';
//import ScrubSquad from './ScrubSquad.js';

const util = require('./utilities.js');
const SB = require('./ScrubBubble');
const c = require('./const.js');

var ledger = require('./ledger.json');   //keeps track of how big of an army each member has as well as bet amounts
var scrubs = [];

exports.maybeDischargeScrubBubble = function() 
{
    var num = util.getRand(1,100);
	if (num > 10) {
        var scrub = new SB();
		scrubs.push(scrub);
    }
    var botMessageTitle = '';
    scrubs.forEach(function(scrub) {
        botMessageTitle += scrub.getRank() + ' Scrubbing Bubbles has arrived for duty!<br>';
    });

    c.BOT.sendMessage({
        to: c.BOT_SPAM_CHANNEL_ID,
        embed:  {
            color: 0xffff00,
            image: {
                title: botMessageTitle,
                url: c.BUBBLE_IMAGES[scrubs.length-1]
            }
        } 
    });
}

exports.enlist = function(userID) 
{
    if (scrubs.length > 0) 
    {
        addToArmy(userID, scrubs);
        c.BOT.sendMessage({
            to: c.BOT_SPAM_CHANNEL_ID,
            message: '<@!' + userID + '>  ' + 'Your Scrubbing Bubbles army has grown by ' + scrubs.length + '! You now have an army of ' + ledger[userID].army.length + '.' 
        });	
        scrubs = [];
    } 
}

function addToArmy(userID, scrubs) 
{
    if (ledger[userID] === undefined) 
    {
        ledger[userID] = { armySize : 0, cleanBet : 0, raceBet : 0, army: [], squads: []};
    }
    for(i = 0; i < scrubs.length; i++)
    {
        ledger[userID].army.push(scrubs[i]);
    }
}

exports.createSquad = function(userID)
{
    ledger[userID].squads.push(new ScrubSquad());
}


//takes userID, number of squad to add scrubs and an array of scrubs to add
exports.addToSquad = function(userID, squadNumber, scrubs)
{
    scrubs.array.forEach(function(scrub) {
        ledger[userID].squads[squadNumber].push(scrub);
    });
}

exports.getSquads = function(userID, squadNumber)
{
    var chat = '';
    var scrubNum = 0;
    ledger[userID].squads[squadNumber].getScrubs().forEach(function(scrub) {
        chat += scrubNum + ". " + scrub.toString() + "\n";
        scrubNum += 1;
    });
    return chat;
}

//export default dnb;