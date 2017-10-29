/*
 *Dungeons and Bathrooms
 *Control armies of scubbing bubbles and clean up bathrooms
 *The game sounded cooler in my head
 */

const util = require('./utilities.js');
const ScrubBubble = require('./ScrubBubble');
const ScrubSquad = require('./ScrubSquad');
const c = require('./const.js');
var dnb = require('./dnb.js');

var ledger = require('./ledger.json');   //keeps track of how big of an army each member has as well as bet amounts

function isInvalidArguments(args) 
{
    for (let i=0; i < args.length; i++)
    {
        if(isNaN(args[i]) || args[i] == undefined) { return true; }
    }
    return false;
}

function isInvalidArgumentsSendMessage(userID, ...args)
{
    if(isInvalidArguments(args))
    {
        util.sendEmbedMessage(null, '<@!' + userID + '>  Missing one or more fields!');
        return true;
    }
    return false;
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

function addToArmy(userID, scrubs) 
{
    util.initUser(userID);
    for(let i = 0; i < scrubs.length; i++)
    {
        ledger[userID].army.push(scrubs[i]);
    }
}

exports.enlist = function(userID) 
{
    util.initUser(userID);
    if (dnb.scrubs.length > 0) 
    {
        addToArmy(userID, dnb.scrubs);
        var message = '<@!' + userID + '>  ' + 'Your Scrubbing Bubbles army has grown by ' + dnb.scrubs.length + '! You now have an army of ' + ledger[userID].army.length + '.';
        util.sendEmbedMessage(null, message);
        dnb.scrubs = [];
    } 
}

exports.createSquad = function(userID)
{
    util.initUser(userID);

    ledger[userID].squads.push(new ScrubSquad());

    var message = '<@!' + userID + '>  ' + 'You have just created squad ' + (ledger[userID].squads.length) + '! Make sure to assign a leader and add Scrubbing Bubbles to it!';
    util.sendEmbedMessage(null, message);
}

exports.deleteSquad = function(userID, args)
{
    util.initUser(userID);
    var squadNumber = Number(args[1])-1;
    
    if(isInvalidArgumentsSendMessage(userID, squadNumber)) { return; }
    if(squadCheck(userID, squadNumber)) { return; }
    
    var scrubs = ledger[userID].squads[squadNumber].getScrubs();
    ledger[userID].army.push.apply(ledger[userID].army, scrubs);
    ledger[userID].squads.splice(squadNumber, 1);

    var message = '<@!' + userID + '>  ' + 'Squad ' + (squadNumber+1) + ' has been removed and scrubs have been added to your unsquaded pool!';
    util.sendEmbedMessage(null, message);
}

exports.removeFromSquad = function(userID, args)
{
    util.initUser(userID);

    var squadNumber = Number(args[1])-1;
    var scrubNumber = Number(args[2])-1;

    if(isInvalidArgumentsSendMessage(userID, squadNumber, scrubNumber)) { return; }
    if(squadCheck(userID, squadNumber)) { return; }
    if(scrubNumber >= ledger[userID].squads[squadNumber].length)
    {
        util.sendEmbedMessage(null, '<@!' + userID + '> That scrub is out of index!');
    }
    
    var scrub = ledger[userID].squads[squadNumber].removeScrub(scrubNumber);
    ledger[userID].army.push(scrub);

    var message = '<@!' + userID + '>  ' + 'The scrub has been removed and has been added to your unsquaded pool!';
    util.sendEmbedMessage(null, message);
}

//takes userID, number of squad to add scrubs and an array of scrubs to add
exports.addToSquad = function(userID, args)
{
    util.initUser(userID);
    var squadNumber = Number(args[1])-1;
    var scrubNumber = Number(args[2])-1;
    if(isInvalidArgumentsSendMessage(userID, squadNumber, scrubNumber)) { return; }

    if(scrubCheck(userID, scrubNumber)) { return; }
    if(squadCheck(userID, squadNumber)) { return; }

    ledger[userID].squads[squadNumber].addScrub(ledger[userID].army[scrubNumber]);
    ledger[userID].army.splice(scrubNumber, 1);

    var message = '<@!' + userID + '>  ' + 'Added a scrub to squad ' + (squadNumber+1) + '!';
    util.sendEmbedMessage(null, message);
}

exports.getSquads = function(userID)
{
    util.initUser(userID);

    var message = '<@!' + userID + '>  Squad count: ' + ledger[userID].squads.length + '!';
    util.sendEmbedMessage(null, message);

    var botMessageDescription = '<@!' + userID + '>\n';
    for(let i = 0; i < ledger[userID].squads.length; i++)
    {
        botMessageDescription = '';
        var squad = ledger[userID].squads[i];
        for(let j = 0; j < squad.length; j++)
        {
            botMessageDescription += (j+1) + '.\t' + squad.getScrub(j).getRank() + ' Scrubbing Bubbles\n';
        }

        util.sendEmbedMessage('Squad ' + (i+1), botMessageDescription);
    }
}

exports.getSquad = function(userID, args)
{
    util.initUser(userID);
    var squadNumber = Number(args[1])-1;

    if(isInvalidArgumentsSendMessage(userID, squadNumber)) { return; }
    if(squadCheck(userID, squadNumber)) { return; }

    var botMessageDescription = '<@!' + userID + '>\n';
    for(let i = 0; i < ledger[userID].squads[squadNumber].length; i++)
    {
        botMessageDescription += (i+1) + '. ' + ledger[userID].squads[squadNumber].getScrub(i).getRank() + ' Scrubbing Bubbles\n';
    }

    util.sendEmbedMessage('Squad ' + (squadNumber+1) + '\'s scrubs:', botMessageDescription);
}

exports.getUnsquaded = function(userID)
{    
    util.initUser(userID);
    
    var botMessageDescription = '<@!' + userID + '>\n';
    for(i = 0; i < ledger[userID].army.length; i++)
    {
        botMessageDescription += (i+1) + '.\t'+ledger[userID].army[i].getRank() + ' Scrubbing Bubbles\n';
    }

    util.sendEmbedMessage('Unsquaded Scrubs', botMessageDescription);
}
//export default dnb;