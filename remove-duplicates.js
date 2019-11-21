const neek = require('neek');

const readable = './responses-not-equal.txt';
const writable = './responses-not-equal-no-duplicates.txt';

neek.unique(readable, writable, function(result){
    console.log(result);
});
