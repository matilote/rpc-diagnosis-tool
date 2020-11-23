const fs = require('fs');
const readline = require('readline');
const axios = require('axios');

const readInterface = readline.createInterface({
    input: fs.createReadStream('./rpc.0.txt'),
    output: process.stdout,
    terminal: false
});

const start = async () =>{
    for await (const line of readInterface) {
        try {
            const response = await axios.post('https://makoto:ahpheithu1ooB1oogu4iuNg8phie6iek6Og7chie@mainnet-supernode.nethermind.io', line, 
            {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              },
            })

            console.log("Request: " + line)
            console.log("Response: " + response.data.result)
            console.log("--------------------------------------")

          } catch(error) {
            console.error(error)
          }
    }
}

start()


