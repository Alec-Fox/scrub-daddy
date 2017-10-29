

class ScrubSquad
{
    constructor()
    {
        this._scrubs = [];
        this._leader;
        this.length = 0;
        this.addScrub = this.addScrub.bind(this);
        this.getScrubs = this.getScrubs.bind(this);
    }

    addScrub(scrubBubble)
    {
        this._scrubs.push(scrubBubble);
        this.length += 1;
    }

    setLeader(scrubBubble)
    {
        var oldLeader = this._leader;
        this._leader = scrubBubble;
        return oldLeader;
    }

    getLeader(scrubBubble)
    {
        this._scrubs.push(scrubBubble);
        this.length += 1;
    }

    getScrubs()
    {
        var tempScrubs = this._scrubs;
        if(this._leader) { tempScrubs.push(this._leader); }
        return tempScrubs;
    }

    getScrub(index)
    {
        if(index >= this._scrubs.length)
        {
            return null;
        }
        return this._scrubs[index];
    }
}

module.exports = ScrubSquad;