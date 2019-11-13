const rpc = require('node-json-rpc')
const fs = require("fs")

const optionsNethermind = {
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
}

const nethermindClient = new rpc.Client(optionsNethermind);
const parityClient = new rpc.Client(optionsParity)
const textFile = fs.readFileSync("rpc.0.txt").toString('utf-8').split("\n");
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

const postRequests = (client) => {
  rpcArray.forEach((request) => {
    let errorRequest = request
    try {
      client === nethermindClient ? name = 'nethermind' : name = 'parity'
      client.call(
        JSON.parse(request),
        function (err, res) {
          try {
            let text = JSON.stringify(res)
            saveToFile('responses', name, text)
          } catch (err) {
            throw err
          }
        })
    } catch (err) {
      saveToFile('errors', name, err + ': ' + errorRequest)
    }
  })
}

postRequests(nethermindClient)
postRequests(parityClient)