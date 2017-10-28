const timestamp = require('console-timestamp');

let _ = msg => console.log(timestamp('DD-MM-YYYY hh:mm:ss') + ' - ' + msg);

function log(msg) {
    _(msg);
}

module.exports.log = log;