const neek = require('neek');

const readable = './responses/responses-not-equal.txt';
const writable = './responses/responses-not-equal-no-duplicates.txt';

neek.unique(readable, writable, function(result){
    console.log("Removing duplicates...")
    console.log(result);
});
