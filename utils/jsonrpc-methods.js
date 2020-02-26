const fetch = require('node-fetch')
const { createFile, createDirectory } = require('./file-helper')

// All modules currently implemented in Nethermind
const modules = ['admin', 'clique', 'debug', 'eth', 'net', 'parity', 'personal', 'proof', 'trace', 'txpool', 'web3']


// Create json object containing all modules with their corresponding methods
const methodsDict = {}
var obj;
// Create json object with empty modules arrays
modules.forEach((mod) => methodsDict[mod] =[])

// Get JSON RPC documentation file from github
// Remove all whitespaces
// Split text file
// Get lines containing JSON RPC methods only
// Remove paranthesses from each method
// Push methods to their dedicated arrays inside methodsDict
async function getJsonRpcDocs(url) {
    return await fetch(url)
        .then((response) => {
            return response.text();
        })
        .then((json) => {
            const textWithoutWhitespaces = json.replace(/ /g,'')
            const textSplitted = textWithoutWhitespaces.split('\n')
            modules.forEach((mod) => textSplitted.filter((line) => {
                if (mod.startsWith(mod)) {
                    if (line.startsWith(`${mod}_`)) {
                        methodsDict[mod].push(line.replace(/ *\([^)]*\) */g, ""))
                    }
                }
            }))
            createDirectory('methods')
            createFile('methods/methods.json', JSON.stringify(methodsDict))
            return methodsDict
    })
}

module.exports = {
    getJsonRpcDocs,
    modules
} 