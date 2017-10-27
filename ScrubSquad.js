

class ScrubSquad
{
    constructor()
    {
        this._scrubs = [];
        this.length = 0;
        this.addScrub = this.addScrub.bind(this);
        this.getScrubs = this.getScrubs.bind(this);
    }

    addScrub(scrubBubble)
    {
        this._scrubs.push(scrubBubble);
        this.length += 1;
    }

    getScrubs()
    {
        return this._scrubs;
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