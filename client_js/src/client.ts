// client.ts

import axios from 'axios';
import https from 'https';
import WebSocket from 'ws';


const server_name = 'https://localhost:8007';
const agent = new https.Agent({
  rejectUnauthorized: false
});

const ws = new WebSocket('wss://localhost:8007', {rejectUnauthorized: false });


//////////////////////////////////
// register the listened websocket events
//////////////////////////////////

ws.on('open', () => {
  console.log('Hello from the client')
  ws.send('Hello from the client');
});

ws.on('close', () => {
  console.log('Bye from the client')
});

ws.on('message', (msg_str: string) => {
  console.log('C1: Client receives: ' + msg_str)
  // Create an event on top of an WebSocket message
  const eventNameRegex = /^CREPES: /;
  if (eventNameRegex.test(msg_str)) {
    console.log("The client considers this event as useful");
    let msg_json = msg_str.replace(eventNameRegex, '');
    console.log('msg_json: ' + msg_json);
    let msg_json2 = JSON.parse(msg_json);
    let current_result: number = parseFloat(msg_json2.total);
    console.log("THE CURRENT RESULT: " + current_result);
  }
});

ws.on('message', (msg_payload: string) => {
  console.log('C2: Again (second registration) Client receives: ' + msg_payload)
});

function stop_websocket () {
  ws.close();
}


//////////////////////////////////
// REST client
//////////////////////////////////


//axios.get(server_name + '/group_result', { httpsAgent: agent })
//  .then(function (response) {
//    // handle success
//    console.log(response.data);
//  })
//  .catch(function (error) {
//    // handle error
//    console.log(error);
//  })
//  .then(function () {
//    // always executed
//    console.log('the end of the GET')
//  });

async function get_result () {
  try {
    const response = await axios.get(server_name + '/group_result', { httpsAgent: agent });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
  console.log('the end2 of the GET')
}

async function post_contribution (point_contribution: number) {
  let post_payload =  {contrib: point_contribution};
  try {
    const response = await axios.post(server_name + '/contribute', post_payload, { httpsAgent: agent });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
  console.log('the end2 of the POST')
  // generate a WebSocket message
  ws.send('GATEAU: ' + JSON.stringify(post_payload));
}


//////////////////////////////////
// play a scenario
//////////////////////////////////

console.log('client.ts says Hello!');

setTimeout(get_result, 1000);
setTimeout(post_contribution, 2000, 5);
setTimeout(post_contribution, 2500, 7);
setTimeout(get_result, 3000);

setTimeout(stop_websocket, 3500);

function end_of_script () {
  console.log('client.ts says Bye!');
};
setTimeout(end_of_script, 4000);

