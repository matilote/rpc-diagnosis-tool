const fs = require("fs")
const fetch = require('node-fetch')
const _ = require('lodash')
const { saveToFile } = require('../utils/file-helper')
require('log-timestamp')('REQUESTER.JS')
const program = require('commander');


// Clients JSON RPC endpoints
const clients = {
  nethermind: "http://134.209.177.40:8545/",
  parity: "http://134.209.177.40:8555/"
}

// Array for JSON RPC requests storage
const rpcArray = [];

// Array of methods which will be ignored when sending to clients
process.argv[2] != undefined ? methods = [...process.argv[2].split(',')] : methods = []

commaSeparatedList = (value, dummyPrevious) => value.split(',');

program
  .option('-m, --methods <items>', 'comma separated list of JSON RPC methods that will be ignored in analysis', commaSeparatedList)
;

program.parse(process.argv);
if (program.methods !== undefined) console.log(program.methods);

// Reads JSON RPC file containing requests which are to be sent to clients
const textFile = fs.readFileSync("./trace-requests.txt").toString('utf-8').split("\n");

// Removes last line of the file if empty
if (!textFile[textFile.length -1]) {
  textFile.pop();
}

// Creates requests file with all requests that have been sent to clients
textFile.forEach((line) => {
  saveToFile('requests/requests', 'all', line)
  rpcArray.push(line)
})

// Removes requests with specified methods
const removeNotWantedMethods = (methods) => {
  if(methods.length == 0) {
    console.log(`No methods will be skipped.`)
  } else {
    console.log(`All requests: ${methods} will be skipped in this analysis.`)
  }
    return rpcArray.filter((el) => !methods.includes(JSON.parse(el).method) ? 
      JSON.parse(el).method : undefined)
} 

// Creates array without unnecessary methods
const array = removeNotWantedMethods(methods)

// Loops through an array of requests
// Sends them to clients concurrently
// Fetch responses and save them to dedicated files in responses folder
array.forEach((request, index) => {
  (async () => {
    const data = await Promise.all([
    fetch(clients.nethermind, { 
    method: 'POST',
    headers: {
    'Accept': 'application/json, text/plain',
    'Content-Type': 'application/json;charset=UTF-8'
    }, 
    body: request }).then((response) => {
      if (response.status != '200') {
        const url = response.url.match(/\bhttp?:\/\/\S+/gi);
        url == clients.nethermind ? clientName = 'nethermind' : clientName = 'parity'
        saveToFile('errors/errors', 'internal', `{"Client_name": "${clientName}", "Response_status_code": "${response.status}", "Error": "${response.statusText}", "Request_${index + 1}": ${request}}`)
      }
      return response.json()}),
    fetch(clients.parity, { 
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
        saveToFile('responses/responses', 'not-equal', `{ "Request": ${request}, "Response_nethermind": ${nethermindResponse}, "Response_parity": ${parityResponse}}`)
      }})
    .catch(error => {
      const url = Object.values(error)[0].match(/\bhttp?:\/\/\S+/gi);
      url == clients.nethermind ? clientName = 'nethermind' : clientName = 'parity'
      saveToFile('errors/errors', 'all', `{"Client_name": "${clientName}", "Response_error": "${error}", "request_${index + 1}": ${request}}`)
  })}
)();
})

console.log(`Files have been successfully created!`)

