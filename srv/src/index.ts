// index.ts
//

import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import https from "https";
import WebSocket from "ws";


const ssl_options = {
    key: fs.readFileSync("srv/kiss_websocket.key"),
    cert: fs.readFileSync("srv/kiss_websocket.crt")
};
const https_port = 8007;

const app = express();
const server = https.createServer(ssl_options, app);
const jsonParser = bodyParser.json();
const wss = new WebSocket.Server({ server });


//////////////////////////////
// global variables
//////////////////////////////

let total_contribution: number = 0;


//////////////////////////////
// serving files
//////////////////////////////

app.get('/', function (req: any, res: any) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/js/kiss_websocket.js', function (req: any, res: any) {
  res.sendFile(__dirname + '/kiss_websocket.js');
});

app.get('/css/kiss_websocket_style.css', function (req: any, res: any) {
  res.sendFile(__dirname + '/kiss_websocket_style.css');
});


//////////////////////////////
// Browser security policy: Access-Control-Allow-Origin
//////////////////////////////

/**
 * @param {module:http.ClientRequest} req
 * @param {module:http.ServerResponse} res
 */
app.use("/", (req: any, res: any, next: any) => {
  //res.header("Access-Control-Allow-Origin", "*");
  if (req.headers.origin) {
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //console.log('dbg061: method: ' + req.method);
  if (req.method === "OPTIONS") {
    res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-type');
  }
  next();
});


//////////////////////////////
// rest api
//////////////////////////////

app.post('/contribute', jsonParser, function (req: any, res: any) {
  console.log('POST body: ', req.body);
  let contrib_n : number = parseFloat(req.body.contrib);
  total_contribution += contrib_n;
  let r_resp= {total: total_contribution, contrib: contrib_n};
  //console.log(r_resp);
  res.end(JSON.stringify(r_resp));
});

app.get('/group_result', function (req: any, res: any) {
  let r_group_result = {total: total_contribution};
  console.log(r_group_result);
  res.json(r_group_result);
});


//////////////////////////////
// websocket service
//////////////////////////////

wss.on('connection', (ws: WebSocket) => {
  console.log('ws: WebSocket connecting');

  ws.on('message', (msg: string) => {
    console.log('received: %s', msg);
    ws.send(`Hello, you sent -> ${msg}`);
    // Create an event on top of an WebSocket message
    if (msg.search(/^GATEAU: /) == 0) {
      console.log("The server considers this event as useful");
      let group_result = {total: total_contribution};
      let r_msg: string = 'CREPES: ' + JSON.stringify(group_result);
      console.log('Server sends: ' + r_msg)
      ws.send(r_msg);
    }
  });

  ws.on('message', (msg: string) => {
    console.log('Event "an other message handler": ', msg);
  });

  ws.on('close', () => {
    console.log('ws: WebSocket disconnecting');
  });

  //send a message just after getting connected
  ws.send('Hello from the WebSocket server!');
});


//////////////////////////////
// running the server
//////////////////////////////

server.listen(https_port, () => {
  //console.log(server.address());
  // @ts-ignore
  let host = server.address().address;
  // @ts-ignore
  let port = server.address().port;
  //console.log("In your browser, open https://%s:%s", host, port);
  console.log("In your browser, open https://localhost:%s", port);
});


