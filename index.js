require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors")

const { SHA256 } = require("crypto-js")

const app = express();
const port = process.env.PORT || '9000'
app.use(express.json())

app.use(express.urlencoded({ extended: false }))
app.use(cors())

class Block {
    constructor(index, timestamp, userData, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.userData = userData;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        // return createHash('sha256').update(this.index + this.timestamp + JSON.stringify(this.userData) + this.previousHash).digest('hex');
        return SHA256(this.index + this.timestamp + JSON.stringify(this.userData) + this.previousHash).toString()
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, new Date().toISOString(), "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newUser) {
        const latestBlock = this.getLatestBlock();
        const newIndex = latestBlock.index + 1;
        const newBlock = new Block(newIndex, new Date().toISOString(), newUser, latestBlock.hash);
        this.chain.push(newBlock);
    }

    isValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

const blockchain = new Blockchain();



app.post('/addUser', (req, res) => {
    const userData = req.body;
    blockchain.addBlock(userData);
    console.log('User data added to the Blockchain:', userData);
    console.log("Block Created : ", blockchain);

    res.json({ message: 'Your data Successfully added to the blockchain', blockchain })
});




app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}/addUser `);
});