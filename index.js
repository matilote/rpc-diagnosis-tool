const rpc = require('node-json-rpc')
const fs = require("fs")
//const inquirer = require('inquirer')
const fetch = require('node-fetch')
const _ = require('lodash')

/*const mainOptions = [{
  type: 'list',
  name: 'mainConfig',
  message: 'Choose client for testing',
  choices: ['Nethermind', 'Parity'],
  filter: function(value) {
      return value.toLowerCase();
  }
}];*/
const textFile = fs.readFileSync("rpc.0.txt").toString('utf-8').split("\n");

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

const nethermindClientUrl = "http://127.0.0.1:8547/";
const parityClientUrl = "http://127.0.0.1:8555/";

//removes requests with eth_blockNumber methods
const array = rpcArray.filter((el) => JSON.parse(el).method != 'eth_blockNumber')

array.forEach((request, index) => {
  (async () => {
    const data = await Promise.all([
    fetch(nethermindClientUrl, { 
    method: 'POST',
    headers: {
    'Accept': 'application/json, text/plain',
    'Content-Type': 'application/json;charset=UTF-8'
    }, 
    body: request }).then((response) => {
      if (response.status != '200') {
        const url = response.url.match(/\bhttp?:\/\/\S+/gi);
        url == nethermindClientUrl ? clientName = 'nethermind' : clientName = 'parity'
        saveToFile('errors', 'internal', `Client name: ${clientName}, Response status code: ${response.status}, Error: ${response.statusText}, Request: ${index + 1}, ${request}`)
      }
      return response.json()}),
    fetch(parityClientUrl, { 
    method: 'POST',
    headers: {
    'Accept': 'application/json, text/plain',
    'Content-Type': 'application/json;charset=UTF-8'
    }, 
    body: request }).then((response) => response.json())
    ])
    .then(response => {
      if (!_.isEqual(response[0], response[1])) {
        const nethermindResponse = JSON.stringify(response[0])
        const parityResponse = JSON.stringify(response[1])
        saveToFile('responses', 'not-equal', `Request: ${request} | Response Nethermind: ${nethermindResponse} | Response Parity: ${parityResponse}`)
      }})
    .catch(error => {
      const url = Object.values(error)[0].match(/\bhttp?:\/\/\S+/gi);
      url == nethermindClientUrl ? clientName = 'nethermind' : clientName = 'parity'
      saveToFile('errors', 'all', `Client name: ${clientName}, Response error: ${error}, request: ${index + 1} ${request}`)
  })}
)();
})

/*
inquirer.prompt(mainOptions).then(o => {
  if (o.mainConfig === 'nethermind') {
    postRequests(nethermindClientUrl)
  } else {
    postRequests(parityClientUrl)
}})*/


