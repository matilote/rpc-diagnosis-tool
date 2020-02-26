const fs = require("fs")

exports.saveToFile = (type, name, text) => {
    fs.appendFile(`${type}-${name}.txt`, text + '\r\n', { 'flag': 'a' }, (err) => {
      if (err) throw err
    })
}

exports.createFile = (filePath, fileContent) => {
    fs.writeFile(filePath, fileContent, (err) => {
        if(err) {
            console.log('An error occurred: ', (err))
        }
    })
}

exports.createDirectory = (directoryPath) => {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true }, (err) => {
            if(err) {
                console.log('An error occurred: ', err)
            }
        })
    }
}