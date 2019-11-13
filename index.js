const rpc = require('node-json-rpc')
const fs = require("fs")
const inquirer = require('inquirer')
const fetch = require('node-fetch');


/*const optionsNethermind = {
  port: 8545,
  host: '127.0.0.1',
  path: '/',
  strict: true
}

const optionsParity = {
  port: 8555,
  host: '127.0.0.1',
  path: '/',
  strict: true
}*/

const mainOptions = [{
  type: 'list',
  name: 'mainConfig',
  message: 'Choose client for testing',
  choices: ['Nethermind', 'Parity'],
  filter: function(value) {
      return value.toLowerCase();
  }
}];

//const nethermindClient = new rpc.Client(optionsNethermind);
//const parityClient = new rpc.Client(optionsParity)
const textFile = fs.readFileSync("rpc.1.txt").toString('utf-8').split("\n");

//removes last line of the file if empty
if (!textFile[textFile.length -1]) {
  textFile.pop();
}

const rpcArray = [];

const saveToFile = (type, name, text) => {
  fs.appendFile(`${type}-${name}.txt`, text + '\r\n', { 'flag': 'a' }, (err) => {
    if (err) throw err
  })
}

textFile.forEach((line) => {
  saveToFile('requests', 'all', line)
  rpcArray.push(line)
})



const nethermindClientUrl = "http://127.0.0.1:8545";
const parityClientUrl = "http://127.0.0.1:8555";

const postRequests = (clientUrl) => {
  clientUrl === nethermindClientUrl ? name = 'nethermind' : name = 'parity'
  rpcArray.forEach((request) => {
    try {
      fetch(clientUrl, { 
        method: 'POST',
        headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json;charset=UTF-8'
        }, 
        body: request }).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          saveToFile('errors', name, `Status code: ${response.status}, response error: ${response.statusText}, request: ${request}`)
        }
        })
        .then((responseJson) => {
          if(responseJson === undefined) {
            saveToFile('invalid-requests', name, `Request: ${request}, Response: ${responseJson}`)
          } else {
            let text = JSON.stringify(responseJson)
            saveToFile('responses', name, text)
          }
        })
        .catch((error) => {
        console.log(error)
      });
      /*
        try {
          let text = JSON.stringify(res)
          saveToFile('responses', name, text)
        } catch (err) {
          throw err;
        }
      })
      client.call(
        JSON.parse(request),
        function (err, res) {
          try {
            let text = JSON.stringify(res)
            saveToFile('responses', name, text)
          } catch (err) {
            throw err;
          }
        })*/
    } catch (err) {
      saveToFile('errors', name, err + ': ' + request)
    }
  })
}

inquirer.prompt(mainOptions).then(o => {
  if (o.mainConfig === 'nethermind') {
    postRequests(nethermindClientUrl)
  } else {
    postRequests(parityClientUrl)
}})
