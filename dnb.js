const util = require('./utilities.js');
const ScrubBubble = require('./ScrubBubble');
const ScrubSquad = require('./ScrubSquad');
const c = require('./const.js');

var ledger = require('./ledger.json');   //keeps track of how big of an army each member has as well as bet amounts
//var scrubs = [];
module.exports.scrubs = [];

exports.maybeDischargeScrubBubble = function() 
{
    var num = util.getRand(1,100);
	if (num > 10) {
        var scrub = new ScrubBubble();
		this.scrubs.push(scrub);
    }
    var botMessageDescription = '';
    this.scrubs.forEach(function(scrub) {
        botMessageDescription += scrub.getRank() + ' Scrubbing Bubbles has arrived for duty!\n';
    });
    
    util.sendEmbedMessage('Ronin Scrubs', botMessageDescription, c.BUBBLE_IMAGES[this.scrubs.length-1]);
}