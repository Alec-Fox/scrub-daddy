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

    c.BOT.sendMessage({
        to: c.BOT_SPAM_CHANNEL_ID,
        embed:  {
            color: 0xffff00,
            title: "Ronin Scrubs",
            description: botMessageDescription,
            image: {
                url: c.BUBBLE_IMAGES[scrubs.length-1]
            }
        } 
    });
}

exports.enlist = function(userID) 
{
    initUser(userID);
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

    c.BOT.sendMessage({
        to: c.BOT_SPAM_CHANNEL_ID,
        message: '<@!' + userID + '>  ' + 'You have just created squad ' + (ledger[userID].squads.length-1) + '! Make sure to assign a leader and add Scrubbing Bubbles to it!' 
    });	
}

exports.deleteSquad = function(userID, args)
{
    initUser(userID);
    var squadNumber = args[1];
    if(squadNumber == undefined)
    {
        c.BOT.sendMessage({
            to: c.BOT_SPAM_CHANNEL_ID,
            message: '<@!' + userID + '>  Enter a squad number!' 
        });	
    }
    if(squadCheck(userID, squadNumber)) { return; }
    
    scrubs = ledger[userID].squads[squadNumber].getScrubs();
    ledger[userID].army.push.apply(ledger[userID].army, scrubs);
    ledger[userID].squads.splice(squadNumber, 1);

    c.BOT.sendMessage({
        to: c.BOT_SPAM_CHANNEL_ID,
        message: '<@!' + userID + '>  ' + 'Squad ' + squadNumber + ' has been removed and scrubs have been added to your unsquaded pool!' 
    });	
}


//takes userID, number of squad to add scrubs and an array of scrubs to add
exports.addToSquad = function(userID, args)
{
    initUser(userID);
    var squadNumber = args[1];
    var scrubNumber = args[2];
    if(squadNumber == undefined || scrubNumber == undefined)
    {
        c.BOT.sendMessage({
            to: c.BOT_SPAM_CHANNEL_ID,
            message: '<@!' + userID + '>  Enter both a squad number and a scrub number!' 
        });	
    }
    if(scrubCheck(userID, scrubNumber)) { return; }
    if(squadCheck(userID, squadNumber)) { return; }
    ledger[userID].squads[squadNumber].addScrub(ledger[userID].army[scrubNumber]);
    ledger[userID].army.splice(scrubNumber, 1);
    c.BOT.sendMessage({
        to: c.BOT_SPAM_CHANNEL_ID,
        message: '<@!' + userID + '>  ' + 'Added a scrub to squad ' + squadNumber + '!' 
    });	
}

exports.getSquads = function(userID)
{
    initUser(userID);

    c.BOT.sendMessage({
        to: c.BOT_SPAM_CHANNEL_ID,
        message: '<@!' + userID + '>  Squad count: ' + ledger[userID].squads.length + '!' 
    });	

    var botMessageDescription = '<@!' + userID + '>\n';
    for(i = 0; i < ledger[userID].squads.length; i++)
    {
        botMessageDescription = '';
        var squad = ledger[userID].squads[i];
        for(j = 0; j < squad.length; j++)
        {
            botMessageDescription += j + '.\t' + squad.getScrub(j).getRank() + ' Scrubbing Bubbles\n';
        }
        c.BOT.sendMessage({
            to: c.BOT_SPAM_CHANNEL_ID,
            embed:  {
                color: 0xffff00,
                title: 'Squad ' + i,
                description: botMessageDescription,
            } 
        });
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

    c.BOT.sendMessage({
        to: c.BOT_SPAM_CHANNEL_ID,
        embed:  {
            color: 0xffff00,
            title: 'Squad ' + squadNumber + '\'s scrubs:',
            description: botMessageDescription,
        } 
    });
}

exports.getUnsquaded = function(userID)
{    
    initUser(userID);
    
    var botMessageDescription = '<@!' + userID + '>\n';
    for(i = 0; i < ledger[userID].army.length; i++)
    {
        botMessageDescription += i + '.\t'+ledger[userID].army[i].getRank() + ' Scrubbing Bubbles\n';
    }

    c.BOT.sendMessage({
        to: c.BOT_SPAM_CHANNEL_ID,
        embed:  {
            color: 0xffff00,
            title: 'Unsquaded Scrubs',
            description: botMessageDescription,
        } 
    });
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
        c.BOT.sendMessage({
            to: c.BOT_SPAM_CHANNEL_ID,
            message: '<@!' + userID + '>  That squad is out of index!' 
        });	 
        return true;
    }
    return false;
}

function scrubCheck(userID, scrubNumber)
{
    if(scrubNumber >= ledger[userID].army.length)
    {
        c.BOT.sendMessage({
            to: c.BOT_SPAM_CHANNEL_ID,
            message: '<@!' + userID + '>  That scrub is out of index!' 
        });	 
        return true;
    }
    return false;
}
//export default dnb;