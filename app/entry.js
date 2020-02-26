"use strict";
const inquirer = require("inquirer");
const { modules, getJsonRpcDocs } = require('../utils/jsonrpc-methods')
inquirer.registerPrompt('search-checkbox', require('inquirer-search-checkbox'));
const exec = require('child_process').execSync;

// JSON RPC Nethermind documentation file
const nethermindJsonRpcDocsUrl = 'https://raw.githubusercontent.com/NethermindEth/nethermind/master/docs/source/jsonrpc.rst'
getJsonRpcDocs(nethermindJsonRpcDocsUrl)

const json = require('./methods/methods.json')

const applications = {
    requester: 'node requester.js',
    duplicateRemover: 'node remove-duplicates.js',
    comparer: 'node comparer.js'
}

inquirer
	.prompt([
        {
			type: "search-checkbox",
			message: "Select JSON RPC methods you wish to ignore",
            name: "methods",
            choices: function(value) {
                const array = []
                modules.forEach((mod) => json[mod].forEach((el) => array.push(el)))
                value = array
                return value
            },
			validate: function(answer) {
				if (answer.length < 1) {
					return "You must choose at least one method.";
				}
				return true;
			}
		}
    ])
	.then(function(answers) {
        console.log(JSON.stringify(answers, null, "  "));
        startProcess(applications.requester, `${answers.methods}`).then(startProcess(applications.comparer))
	})
    .catch(e => console.log(e));

async function startProcess(name, args) {
    exec(`${name} ${args}`, {stdio: 'inherit'},
    (error, stdout, stderr) => {
        console.log(`Running ${name} application...`)
        console.log(`${stdout}`)
        console.log(`${stderr}`)
        if (error) {
            console.error(`There was an error when starting ${name}`)
        }
    });
}
