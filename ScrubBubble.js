//import ScrubSquad from './ScrubSquad.js';
class ScrubBubble
{
    constructor()
    {
        this._rank = 'Pvt.';
        this. _experience = 0;
        this. _leaderExperience = 0;
        this.getRank = this.getRank.bind(this);
        this.getExperience = this.getExperience.bind(this);
        this.getLeaderExperience = this.getLeaderExperience.bind(this);
    }

    getRank()
    {
        return this._rank;
    }
    
    getExperience()
    {
        return this._experience;
    }
    
    getLeaderExperience()
    {
        return this._leaderExperience;
    }
    
    toString()
    {
        var string = '';
        string += this._Rank + ' Scrubbing Bubble\n';
        string += 'Experience: ' + this._experience + '\n';
        string += 'Leader experience: ' + this._leaderExperience + '\n';
    }
}
module.exports = ScrubBubble;