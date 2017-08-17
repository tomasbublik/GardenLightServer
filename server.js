const child = require('child_process');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const exec = child.exec;

const NEGATIVE_RESPONSE = "FAILED";
const POSITIVE_RESPONSE = "OK";

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);

app.get('/', function (req, res) {
    res.send("To change lights state, call either /on or /off. To get the status, call /state." +
        "You can also call /hostname to get the hostname of the server. All the commands can be suffixed with \"Async\" tail to get the asynchronous version");
    res.end();
});

app.get('/on', function (req, res) {
    changeState(true, res);
});

app.get('/off', function (req, res) {
    changeState(false, res);
});

app.get('/state', function (req, res) {
    checkState(res);
});

app.get('/hostname', function (req, res) {
    getHostname(res);
});

const setState = function (stateString, res) {
    exec(stateString, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
            res.end(NEGATIVE_RESPONSE);
        } else {
            res.end(POSITIVE_RESPONSE);
        }
    });
};

function changeState(state, res) {
    if (state) {
        setState("on", res);
    } else {
        setState("off", res);
    }
    console.log("Current state called: " + state);
}

const checkState = function (res) {
    executeCommand("state", res);
};

const getHostname = function (res) {
    executeCommand("hostname", res);
};

function executeCommand (command, res) {
    exec(command, function (error, stdout, stderr) {
        var response = "-1";
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        } else {
            response = stdout.toString();
        }
        console.log("Command result: " + response);
        res.end(response)
    });
}