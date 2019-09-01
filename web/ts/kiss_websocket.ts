// kiss_websocket.ts


const server_name: string = 'https://localhost:8007';
const socket = new WebSocket('wss://localhost:8007');


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
      // Send a WebSocket message
      socket.send('GATEAU: ' + JSON.stringify(post_payload));
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

socket.addEventListener('open', (event) => {
  console.log('Hello from the client')
  socket.send('Hello from the client');
});

socket.addEventListener('close', (event) => {
  console.log('Bye from the client')
});

socket.addEventListener('message', (event) => {
  let msg_str:string = event.data;
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
    (<HTMLParagraphElement>document.querySelector('#push_quantity_out')).innerHTML = current_result.toString();
  }
});

// a send eventListner for message
socket.addEventListener('message', (event) => {
  console.log('C2: Again (second registration) Client receives: ' + event.data)
});


/////////////////////////////////////////
// Event when the page/tab is activated
/////////////////////////////////////////

document.addEventListener('visibilitychange', () => {
  console.log("Visibility of page has changed!");
  let dummy_payload =  {contrib: '0'};
  socket.send('GATEAU: ' + JSON.stringify(dummy_payload));
});

