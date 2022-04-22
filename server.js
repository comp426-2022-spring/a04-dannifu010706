const args = require('minimist')(process.argv.slice(2))
var express = require("express")
var app = express()
const logdb = require("./database.js")
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
args["port"]
args["debug"]=false
args["log"]=true
args["help"]
var port = args.port | 5555


app.get('/app/echo/:number',(req,res)=>{
    res.status(200)/json({'message':req.params.number})
})

function coinFlip() {
    return Math.random() > .5 ? ("heads") : ("tails")
  }

function coinFlips(flips) {
    var arr = [];
    for(let i =0 ; i<flips;i++){
      arr.push(coinFlip());
    }
   return arr;
  }

  function countFlips(array) {
    let result={};
    array.forEach((item) => { 
      if(result[item]){
        result[item]++;
      }else{
        result[item]=1;
      }
    });
    return result;
   }

   function flipACoin(call) {
  
    const results = {call: '', flip: '', result: ''}
    results.call=call;
    results.flip=coinFlip();
    if(results.call==results.flip){
      results.result="win";
    }
    else{
      results.result="lose";
    }
    return results;
    }
  


app.get('/app',(req,res)=> {
   res.statusCode=200;
   res.statusMessage='OK';
   res.writeHead(res.statusCode,{'Content-Type':'text/plain'});
   res.end(res.statusCode+' '+res.statusMessage)

})
app.get('/app/flip',(req,res)=>{
    var flips = coinFlip()
    
    res.status(200).json({ 'flip':flip})
})
app.get('/app/flips/:number',(req,res)=>{
    const flips = (req.params.number)
    const coins=coinFlips(flips)
    res.status(200).json({ 'raw':coins,'summary':countFlips(coins)})
})

app.get('/app/flip/call/:call',(req,res)=>{
const calling =(req.params.call)
const coin = coinFlip()
var result ="win"
if(coin!=calling){
    result="lose"
}
res.status(200).json({"call":calling,"flip":coin,"result":result})


})
app.use(function(req,res){
    res.status(404).send("Endpoint does not exist")
    res.type("text/plain")
})


if (args.help) {
    console.log(help)
    process.exit(0)
}

const server = app.listen(port, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",port))
});
app.get("/app/", (req, res) => {
    res.json({"message":"Your API works! (200)"});
	res.status(200);
});

// //app.use( (req, res, next) => {
//     let logdata = {
//         remoteaddr: req.ip,
//         remoteuser: req.user,
//         time: Date.now(),
//         method: req.method,
//         url: req.url,
//         protocol: req.protocol,
//         httpversion: req.httpVersion,
//         status: res.statusCode,
//         referer: req.headers['referer'],
//         useragent: req.headers['user-agent']
//     }
//     const stmt = logdb.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
//     const info = stmt.run(logdata.remoteaddr, logdata.remoteuser,  logdata.method, logdata.url, logdata.protocol, logdata.httpversion, logdata.status, logdata.referer, logdata.useragent)
//     res.status(200).json(info)
//     next()
// });

if(args.debug===true){
    app.get("/app/log/access",(req,res) =>{
     
         const stmt = logdb.prepare('SELECT * FROM accesslog').all()
         res.status(200).json(stmt)}
    )
    app.get("/app/error",(req,res) =>{
     throw new Error('Error test successful.')
 
    })
    
const morgan = require("morgan");
const fs = require("fs");
const accessLog = fs.createWriteStream("./data/log/access.log", { flags: "a" });
app.use(morgan("combined", { stream: accessLog }));

 
 }