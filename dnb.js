/*
 *Dungeons and Bathrooms
 *Control armies of scubbing bubbles and clean up bathrooms
 *The game sounded cooler in my head
 */

//import ScrubBubble from './ScrubBubble.js';
//import ScrubSquad from './ScrubSquad.js';

const util = require('./utilities.js');
const SB = require('./ScrubBubble');
require('./ScrubBubble.js');

var ledger = require('./ledger.json');   //keeps track of how big of an army each member has as well as bet amounts
var dropped = 0;

exports.maybeDischargeScrubBubble = function() 
{
    var num = util.getRand(1,100);
	if (num > 10) {
		return require('./ScrubBubble.js');
	}
}

exports.enlist = function(userID) 
{
    if (dropped > 0) 
    {
        addToArmy(userID, dropped);
        c.BOT.sendMessage({
            to: c.BOT_SPAM_CHANNEL_ID,
            message: '<@!' + userID + '>  ' + 'Your Scrubbing Bubbles army has grown by ' + dropped + '! You now have an army of ' + ledger[userID].army.length + '.' 
        });	
        dropped = 0;
    } 
}

function addToArmy(userID, amount) 
{
    if (ledger[userID] === undefined) 
    {
        ledger[userID] = { armySize : 0, cleanBet : 0, raceBet : 0};
    }
    for(i = 0; i < amount; i++)
    {
        ledger[userID].army.push(new ScrubBubble.ScrubBubble());
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