

class ScrubSquad
{
    constructor()
    {
        this._scrubs = [];
        this._leader;
        this.length = 0;
        this.addScrub = this.addScrub.bind(this);
        this.removeScrub = this.removeScrub.bind(this);
        this.getScrub = this.getScrub.bind(this);
        this.getScrubs = this.getScrubs.bind(this);
        this.setLeader = this.setLeader.bind(this);
        this.getLeader = this.getLeader.bind(this);
    }

    addScrub(scrubBubble)
    {
        this._scrubs.push(scrubBubble);
        this.length += 1;
    }

    removeScrub(index)
    {
        if(index >= this._scrubs.length)
        {
            return null;
        }
        var scrub = this._scrubs[index];
        this._scrubs.splice(index, 1);

        return scrub;
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
}

module.exports = ScrubSquad;