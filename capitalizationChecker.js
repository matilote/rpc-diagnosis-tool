// npm install -s split
const split = require('split')

const input = process.stdin.pipe(split())

const allVariables = []
const foundWords = {}

function deCapFirst(word) {
	if (word == word.toUpperCase()) {
		return word
	}
	return word[0].toLowerCase() + word.slice(1)
}

function deCapLast(word) {
	if (word == word.toUpperCase()) {
		return word
	}
	return word.slice(0, -1) + word.slice(-1).toLowerCase()
}

const trimComment = line => {
	let startCommentIndex = line.match(/\/\//) ? line.match(/\/\//).index : null
	return startCommentIndex ? line.slice(0, startCommentIndex) : line
}

input.on('data', line => {
	let newLine = trimComment(line)
	let variables = [...newLine.matchAll(/\w+/g)].map(arr => arr[0])
	for (let variable of variables) {
		if (variable == variable.toUpperCase()) continue
		if (variable.length <= 2) continue
		if (!allVariables.includes(variable)) {
			allVariables.push(variable)
		}
	}
})

function getWords(variables) {
	allWords = []
	for (let variable of variables) {
		let words = ([...variable.matchAll(/(\w[a-z]+)|([A-Z]+[a-z]+)/g)].map(arr => arr[0]))
		for (word of words) {
			if (!allWords.includes(word)) {
				allWords.push(word)
			}
		}
	}
	return allWords
}

input.on('end', () => {
	let words = getWords(allVariables);

	for (word of words) {
		for (variable of allVariables) {
			if (variable.toLowerCase().includes(word.toLowerCase())) {
				let startIndex = variable.toLowerCase().match(word.toLowerCase()).index

				// Trim should start either at the beginning of the variable or at a big letter
				if ((startIndex == 0) || (variable[startIndex] == variable[startIndex].toUpperCase())) {
					let endIndex = startIndex + word.length
					let trimmedVariable = variable.slice(startIndex, endIndex)

					// Ignoring: Blockhash | blockhash
					if (deCapFirst(trimmedVariable) == deCapFirst(word)) continue

					// Ignoring: proposals | proposalS
					if (trimmedVariable.length > 2) {
						if (deCapFirst(deCapLast(trimmedVariable)) == deCapFirst(deCapLast(word))) continue
					} else {
							// Ignoring: 2F
							if (!isNaN(parseInt(word[0]))) continue 
					}
					
					// If it's the first time we meet the difference - initialize foundWords with a base lowercase word as key
					if (!(word.toLowerCase() in foundWords)) {
						foundWords[word.toLowerCase()] = [word]
					}

					// Add a difference as an element of the array: { datetime: ['dateTime', 'datetime'] }
					if (!(foundWords[word.toLowerCase()].includes(trimmedVariable))) {
						foundWords[word.toLowerCase()].push(trimmedVariable)
					}
				}
			}
		}
	}

	console.table(foundWords)
})
