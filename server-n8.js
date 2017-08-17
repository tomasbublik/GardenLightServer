const child = require('child_process');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const {promisify} = require('util');
const exec = promisify(child.exec);

let NEGATIVE_RESPONSE = "FAILED";
let POSITIVE_RESPONSE = "OK";

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

app.get('/onAsync', async (req, res) => {
    const response = await setStateAsync("on");
    res.end(response);
});

app.get('/off', function (req, res) {
    changeState(false, res);
});

app.get('/offAsync', async (req, res) => {
    const response = await setStateAsync("off");
    res.end(response);
});

app.get('/state', function (req, res) {
    checkState(res);
});

app.get('/stateAsync', async (req, res) => {
    const state = await checkStateAsync();
    res.end(state);
});

app.get('/hostname', function (req, res) {
    getHostname(res);
});

app.get('/hostnameAsync', async (req, res) => {
    const state = await getHostnameAsync();
    res.end(state);
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

let executeCommand = function (command, res) {
    exec(command, function (error, stdout, stderr) {
        let response = "-1";
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
};

const setStateAsync = async () => {
    return (async (stateString) => {
        try {
            const result = await exec(stateString);
            console.log('stdout: ' + result.stdout);
            console.log('exec error: ' + result.error);
            console.log('stderr: ' + result.stderr);
            return (POSITIVE_RESPONSE);
        } catch (ex) {
            ex => console.error(error);
            return (NEGATIVE_RESPONSE);
        }
    })();
};

let checkStateAsync = async () => {
    return await commandAsync("state");
};

let getHostnameAsync = async () => {
    return await commandAsync("hostname");
};

let commandAsync = async function (command) {
    return (async () => {
        try {
            const result = await exec(command);
            console.log("Now log the result");
            console.log(result.toString());
            return result.stdout;
        } catch (ex) {
            ex => console.error(error);
            return NEGATIVE_RESPONSE;
        }
    })();
};