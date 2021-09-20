Index.js

const http = require("http")
const fs = require("fs");
var requests = require("requests");
const { parse } = require("path");
        
const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal, orgVal) =>{
    let temprature = tempVal.replace("{%tempval%}", Math.round(orgVal.main.temp-273));
    temprature = temprature.replace("{%tempmin%}", Math.round(orgVal.main.temp_min-273));
    temprature = temprature.replace("{%tempmax%}", Math.round(orgVal.main.temp_max-273));
    temprature = temprature.replace("{%location%}", orgVal.name);
    temprature = temprature.replace("{%country%}", orgVal.sys.country);
    return temprature;
}
const server = http.createServer((req, res) =>{
    if(req.url == "/"){
        requests("http://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=432ab7b226737432ccb2eaad3b8c69ac")
        .on("data", (chunk) => {
            const objData = JSON.parse(chunk);
            const arrayData = [objData];
            const realTimeData = arrayData.map(val =>replaceVal(homeFile, val)).join("");
            res.write(realTimeData);
            // console.log(realTimeData);
        })
        .on("end", (err) => {
            if(err) return console.log("connection closed due to errors", err);
            res.end();
        });
    }    
});
server.listen(8000, "127.0.0.1");