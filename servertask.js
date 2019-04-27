var http = require("http");
var url = require("url");
http.createServer(function(request, response){
    response.writeHead(200, {"Content-Type":"text/plain"});
    var params = url.parse(request.url,true).query;
    console.log(params);
    var s = params.sender;
    var r = params.reciver;
    var a = params.amount;
    class Block{
        constructor(index, data, prevHash){
            //data (sender + reciver + amount) put it in json
            this.index = index;
            this.timestamp = Math.floor(Date.now() / 1000);
            this.data = data;
            this.prevHash = prevHash;
            this.hash = this.getHash();
        }
        getHash(){
            const sha = require('crypto');
            return sha.createHash('sha256').update(JSON.stringify(this.data) + this.prevHash + this.index + this.timestamp).digest('hex');
        }
    }
    class BlockChain{
        constructor(){
            this.chain = [];
        }
        addBlock(data){
            let index = this.chain.length;
            //check of that block first or second
            let prevHash = this.chain.length !== 0 ? this.chain[this.chain.length - 1].hash : 0;
            let block = new Block(index, data, prevHash);
            this.chain.push(block);
        }
        chainIsValid(){
            for(var i=0;i<this.chain.length;i++){
                //comparing the stored hash with a newly calculated hash
                if(this.chain[i].hash !== this.chain[i].getHash())
                    return false;
                //the previousHash attribute is storing the same value as the hash
                // of the previous block
                if(i > 0 && this.chain[i].prevHash !== this.chain[i-1].hash)
                    return false;
            }
            return true;
        }
    }
    const CILCoin = new BlockChain();
    CILCoin.addBlock({sender: s, reciver: r, amount: a});
    console.log(JSON.stringify(CILCoin, null, 4));
    response.write(JSON.stringify(CILCoin, null, 4));
    response.end();
}).listen(10001);