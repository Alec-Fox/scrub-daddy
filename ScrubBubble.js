window.scrubSpace = window.scrubSpace || { };

class ScrubBubble
{
    constructor()
    {
        var _rank = 'private';
        var _experience = 0;
        var _leaderExperience = 0;
    }

    getRank()
    {
        return _rank;
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