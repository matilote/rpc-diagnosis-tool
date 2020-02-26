const fs = require("fs")
const uuidv4 = require('uuid/v4');
const _ = require('lodash')
const { createFile, createDirectory } = require('../utils/file-helper')
require('log-timestamp')('COMPARER.JS')


const textFile = fs.readFileSync("./responses/responses-not-equal.txt").toString('utf-8').split("\n");

// Removes last line of the file if empty
if (!textFile[textFile.length -1]) {
    textFile.pop();
}

const arrayFormatted = textFile.map((el) => {
    const array = el.split('|').map(el => {
        return element = '{' + el.substring(el.indexOf("{") + 1)
    })
    return array;
})
const arr = arrayFormatted.map(el => el.map(item => {
    try {
        return item = JSON.parse(item)
    } catch (e) {
        console.log(item)
        console.log(e)
    }
}))

const set = new Set()

createDirectory('outputs')

try {
    arr.map(subarray => subarray.filter(item => {
        if(item != undefined) {
            _.has(item.Request, 'method') && 
            !set.has(item.Request.method) &&
            set.add(item.Request.method) &&
            set.add(item.Response_nethermind) &&
            set.add(item.Response_parity)
            sampleDirectory = `sample_${uuidv4()}`
            sampleDirectoryLayer = `outputs/${item.Request.method}/${sampleDirectory}`
            createDirectory(`outputs/${item.Request.method}`)
            createDirectory(sampleDirectoryLayer)
            createFile(`${sampleDirectoryLayer}/Request.json`, `${JSON.stringify(item.Request)}`)
            createFile(`${sampleDirectoryLayer}/Nethermind_response.json`, `${JSON.stringify(item.Response_nethermind)}`)
            createFile(`${sampleDirectoryLayer}/Parity_response.json`, `${JSON.stringify(item.Response_parity)}`)
        }
    }))

    if (set.size != 0 ) {
        console.log("Methods affected: ") &
        set.forEach(function(value) {
            if (typeof value == 'string') {
                console.log(value)
            }
        })
    }

    console.log('Responses have been sucessfully compared!')
} catch (e) {
    console.log('Something went wrong. Responses were not compared' + e)
}