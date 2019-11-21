const fs = require("fs")
const uuidv4 = require('uuid/v4');
const _ = require('lodash')

const textFile = fs.readFileSync("./responses-not-equal-no-duplicates.txt").toString('utf-8').split("\n");

const arrayFormatted = textFile.map((el) => {
    const array = el.split('|').map(el => {
        return element = '{' + el.substring(el.indexOf("{") + 1)
    })
    return array;
})

const request = arrayFormatted[2][0]
const nethermindResponse = arrayFormatted[2][1]
const parityResponse = arrayFormatted[2][2]
const method = JSON.parse(request).method

let arr = arrayFormatted.map(el => el.map(item => {
    try {
        return item = JSON.parse(item)
    } catch (e) {}
}))

const set = new Set()
const filtered = arr.map(subarray => subarray.filter(item => _.has(item, 'method') && !set.has(item.method) && set.add(item.method)))
const result =  filtered.filter(e => e.length);

console.log(set)

fs.appendFile(`${method}_${uuidv4()}`, `Request: ${request}` + '\r\n' + `Nethermind response: ${nethermindResponse}` + '\r\n' + `Parity response: ${parityResponse}`, { 'flag': 'a' }, (err) => {
    if (err) throw err
})