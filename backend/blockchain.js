
class Blockchain {
    constructor() {
        this.chain = [];
        this.addBlock({ candidate: 'Genesis Block' });
    }

    addBlock(data) {
        const newBlock = {
            index: this.chain.length + 1,
            timestamp: new Date(),
            data,
            previousHash: this.chain.length === 0 ? null : this.chain[this.chain.length - 1].hash,
            hash: this.calculateHash(data)
        };
        this.chain.push(newBlock);
    }

    calculateHash(data) {
        return require('crypto').createHash('sha256').update(JSON.stringify(data)).digest('hex');
    }

    getChain() {
        return this.chain;
    }
}

module.exports = { Blockchain };
