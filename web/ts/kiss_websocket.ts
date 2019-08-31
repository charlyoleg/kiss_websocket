// kiss_websocket.ts

// @ts-ignore
//import * as zog from '/socket.io/socket.io.js';
//import io from 'socket.io-client';

const server_name: string = 'https://localhost:8007';



/////////////////////////////////////////
// Http Rest Api
/////////////////////////////////////////

function sendPoints () {
  let point_contribution  = (<HTMLInputElement>document.querySelector('#quantity_in')).value;
  console.log("Send a contribution of " + point_contribution + " points.");
  let post_payload =  {contrib: point_contribution};
  fetch(server_name + '/contribute', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post_payload)
    }).then((res) =>  {
      if (res.ok) {
        return res.json();
      }
      throw new Error('ERR026: Network response was not ok.');
    }).then((resJson) => {
      console.log('POST successful with response: ' + JSON.stringify(resJson));
      // SocketIO emits an event
      //socket.emit('one more contribution', post_payload);
    }).catch((err) => {
      console.log('ERR030: POST with error:', err);
    });
}

function askResult () {
  fetch(server_name + '/group_result')
    .then((res) => { // http response
      if (res.ok) {
        return res.text(); // consuming the http body
      }
      throw new Error('Network response was not ok.');
    }).then((resText) => {
      //console.log('fetch response text: ', resText);
      let resJson = JSON.parse(resText);
      let current_result: number = parseFloat(resJson.total);
      console.log("current_result: " + current_result);
      (<HTMLParagraphElement>document.querySelector('#pull_quantity_out')).innerHTML = current_result.toString();
    }).catch(function (error) {
      console.log('Failing fetch operation: ', error.message);
    });
}

(<HTMLButtonElement>document.querySelector('#button_send')).addEventListener('click', sendPoints);
(<HTMLButtonElement>document.querySelector('#button_ask')).addEventListener('click', askResult);


/////////////////////////////////////////
// WebSocket event receivers
/////////////////////////////////////////

//socket.on('update result', function (event_data: any) {
//  //console.log(event_data);
//  //let event_data_json = JSON.parse(event_data);
//  let current_result: number = parseFloat(event_data.total);
//  console.log("event_result: " + current_result);
//  (<HTMLParagraphElement>document.querySelector('#push_quantity_out')).innerHTML = current_result.toString();
//});
//
//socket.on('connect', function (event_data: any) {
//  console.log('socketio connecting. event_data: ', event_data);
//  //console.log(event_data);
//});
//
//socket.on('disconnect', function (event_data: any) {
//  console.log('socketio disconnecting. event_data: ', event_data);
//  //console.log(event_data);
//});


/////////////////////////////////////////
// Event when the page/tab is activated
/////////////////////////////////////////

document.addEventListener('visibilitychange', () => {
  console.log("Visibility of page has changed!");
  let dummy_payload =  {contrib: '0'};
  //socket.emit('one more contribution', dummy_payload);
});

