const { decToHex } = require('../utils/dec-to-hex')
const { saveToFile } = require('../utils/file-helper')


for(let b = process.argv[2]; b < process.argv[3]; b++) {
    const block = decToHex(b)
    const request = `{"method":"trace_replayBlockTransactions","params":["${block}",["trace"]],"id":1,"jsonrpc":"2.0"}`
    saveToFile('trace','requests', request)
}