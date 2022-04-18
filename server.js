const args = require('minimist')(process.argv.slice(2))
var express = require("express")
var app = express()
const db = require("./database.js")
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
args["port"]
args["debug"]=false
args["log"]=true
args["help"]
var port = args.port | 5555

if (args.help) {
    console.log(args.help)
    process.exit(0)
}

const server = app.listen(port, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",port))
});
app.get("/app/", (req, res, next) => {
    res.json({"message":"Your API works! (200)"});
	res.status(200);
});

app.use("/app/new/log", (req, res, next) => {
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
    }
    const stmt = db.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const info = stmt.run(req.ip, req.user, Date.now(), req.method, req.url, req.protocol, req.httpVersion, res.statusCode, req.headers['referer'], req.headers['user-agent'])
    res.status(200).json(info)
    next()
});

if(args.debug==true){
    app.get("/app/log/access",(req,res) =>{
     try {
         const stmt = db.prepare('SELECT * FROM accesslog').all()
         res.status(200).json(stmt)
     } catch {
         console.error(e)
     }
 
    })
    app.get("/app/error",(req,res) =>{
     throw new Error('Error test successful.')
 
    })
 
 }