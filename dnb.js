/*
 *Dungeons and Bathrooms
 *Control armies of scubbing bubbles and clean up bathrooms
 *The game sounded cooler in my head
 */

//import { ScrubBubble } from './ScrubBubble.js';
//import ScrubSquad from './ScrubSquad.js';

const util = require('./utilities.js');
const ScrubBubble = require('./ScrubBubble');
const ScrubSquad = require('./ScrubSquad');
const c = require('./const.js');

var ledger = require('./ledger.json');   //keeps track of how big of an army each member has as well as bet amounts
var scrubs = [];

exports.maybeDischargeScrubBubble = function() 
{
    var num = util.getRand(1,100);
	if (num > 10) {
        var scrub = new ScrubBubble();
		scrubs.push(scrub);
    }
    var botMessageDescription = '';
    scrubs.forEach(function(scrub) {
        botMessageDescription += scrub.getRank() + ' Scrubbing Bubbles has arrived for duty!\n';
    });

    util.sendEmbedMessage('Ronin Scrubs', botMessageDescription, c.BUBBLE_IMAGES[scrubs.length-1]);
}

exports.enlist = function(userID) 
{
    initUser(userID);
    if (scrubs.length > 0) 
    {
        addToArmy(userID, scrubs);
        var message = '<@!' + userID + '>  ' + 'Your Scrubbing Bubbles army has grown by ' + scrubs.length + '! You now have an army of ' + ledger[userID].army.length + '.';
        util.sendEmbedMessage(null, message);
        scrubs = [];
    } 
}

function addToArmy(userID, scrubs) 
{
    initUser(userID);
    for(i = 0; i < scrubs.length; i++)
    {
        ledger[userID].army.push(scrubs[i]);
    }
}

exports.createSquad = function(userID)
{
    initUser(userID);

    ledger[userID].squads.push(new ScrubSquad());
    var message = '<@!' + userID + '>  ' + 'You have just created squad ' + (ledger[userID].squads.length-1) + '! Make sure to assign a leader and add Scrubbing Bubbles to it!';
    util.sendEmbedMessage(null, message);
}

exports.deleteSquad = function(userID, args)
{
    initUser(userID);
    var squadNumber = args[1];
    if(squadNumber == undefined)
    {
        util.sendEmbedMessage(null, '<@!' + userID + '>  Enter a squad number!');
    }
    if(squadCheck(userID, squadNumber)) { return; }
    
    scrubs = ledger[userID].squads[squadNumber].getScrubs();
    ledger[userID].army.push.apply(ledger[userID].army, scrubs);
    ledger[userID].squads.splice(squadNumber, 1);

    var message = '<@!' + userID + '>  ' + 'Squad ' + squadNumber + ' has been removed and scrubs have been added to your unsquaded pool!';
    util.sendEmbedMessage(null, message);
}


//takes userID, number of squad to add scrubs and an array of scrubs to add
exports.addToSquad = function(userID, args)
{
    initUser(userID);
    var squadNumber = args[1];
    var scrubNumber = args[2];
    if(squadNumber == undefined || scrubNumber == undefined)
    {
        var message = '<@!' + userID + '>  Enter both a squad number and a scrub number!';
        util.sendEmbedMessage(null, message);
    }
    if(scrubCheck(userID, scrubNumber)) { return; }
    if(squadCheck(userID, squadNumber)) { return; }

    ledger[userID].squads[squadNumber].addScrub(ledger[userID].army[scrubNumber]);
    ledger[userID].army.splice(scrubNumber, 1);

    var message = '<@!' + userID + '>  ' + 'Added a scrub to squad ' + squadNumber + '!';
    util.sendEmbedMessage(null, message);
}

exports.getSquads = function(userID)
{
    initUser(userID);

    var message = '<@!' + userID + '>  Squad count: ' + ledger[userID].squads.length + '!';
    util.sendEmbedMessage(null, message);

    var botMessageDescription = '<@!' + userID + '>\n';
    for(i = 0; i < ledger[userID].squads.length; i++)
    {
        botMessageDescription = '';
        var squad = ledger[userID].squads[i];
        for(j = 0; j < squad.length; j++)
        {
            botMessageDescription += j + '.\t' + squad.getScrub(j).getRank() + ' Scrubbing Bubbles\n';
        }

        util.sendEmbedMessage('Squad ' + i, botMessageDescription);
    }
}

exports.getSquad = function(userID, args)
{
    initUser(userID);
    var squadNumber = args[1];
    if(squadCheck(userID, squadNumber)) { return; }

    var botMessageDescription = '<@!' + userID + '>\n';
    for(i = 0; i < ledger[userID].squads[squadNumber].length; i++)
    {
        botMessageDescription += i + '. ' + ledger[userID].squads[squadNumber].getScrub(i).getRank() + ' Scrubbing Bubbles\n';
    }

    util.sendEmbedMessage('Squad ' + squadNumber + '\'s scrubs:', botMessageDescription);
}

exports.getUnsquaded = function(userID)
{    
    initUser(userID);
    
    var botMessageDescription = '<@!' + userID + '>\n';
    for(i = 0; i < ledger[userID].army.length; i++)
    {
        botMessageDescription += i + '.\t'+ledger[userID].army[i].getRank() + ' Scrubbing Bubbles\n';
    }

    util.sendEmbedMessage('Unsquaded Scrubs', botMessageDescription);
}

function initUser(userID)
{
    if (ledger[userID] === undefined) 
    {
        ledger[userID] = { armySize : 0, cleanBet : 0, raceBet : 0, army: [], squads: []};
    }
}

function squadCheck(userID, squadNumber)
{
    if(squadNumber >= ledger[userID].squads.length)
    {
        util.sendEmbedMessage(null, '<@!' + userID + '>  That squad is out of index!');
        return true;
    }
    return false;
}

function scrubCheck(userID, scrubNumber)
{
    if(scrubNumber >= ledger[userID].army.length)
    {
        util.sendEmbedMessage(null, '<@!' + userID + '>  That scrub is out of index!');
        return true;
    }
    return false;
}
//export default dnb;