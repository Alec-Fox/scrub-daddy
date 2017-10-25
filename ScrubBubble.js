//import ScrubSquad from './ScrubSquad.js';
class ScrubBubble
{
    constructor()
    {
        this._rank = 'Private';
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
        return _experience;
    }
    
    getLeaderExperience()
    {
        return _leaderExperience;
    }
    
    toString()
    {
        var string = '';
        string += _Rank + " Scrubbing Bubble\n";
        string += "Experience: " + _experience + "\n";
        string += "Leader experience: " + _leaderExperience + "\n";
    }
}
module.exports = ScrubBubble;