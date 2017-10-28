const child = require('child_process');
const express = require('express');
const timestamp = require('console-timestamp');
let schedule = require('node-schedule');
let SunCalc = require('suncalc');

const app = express();
const port = process.env.PORT || 3000;
const exec = child.exec;

const NEGATIVE_RESPONSE = "FAILED";
const POSITIVE_RESPONSE = "OK";
const HOSIN_LATITUDE = 49.037303;
const HOSIN_LONGITUDE = 14.475924;
const ABSOLUTELY_FAR_AWAY_DATE = new Date(2042, 11, 21, 5, 30, 0);
const HOW_LONG_HRS = 2;
const TIMEZONE_SHIFT = 2;

app.listen(port);

let _ = msg => console.log(timestamp('DD-MM-YYYY hh:mm:ss') + ' - ' + msg);

let eveningTurnOn = schedule.scheduleJob(ABSOLUTELY_FAR_AWAY_DATE, function () {
    _('Activating the lights in the evening');
    changeState(true, "");
});

let eveningTurnOff = schedule.scheduleJob(ABSOLUTELY_FAR_AWAY_DATE, function () {
    _('Deactivating the lights in the evening');
    changeState(false, "");
});

let setEveningTiming = function () {
    let times = SunCalc.getTimes(new Date(), HOSIN_LATITUDE, HOSIN_LONGITUDE);
    let eveningTime = times.dusk;

    _("Dusk time is: " + eveningTime);
    eveningTime.setHours(eveningTime.getHours());
    schedule.rescheduleJob(eveningTurnOn, eveningTime);

    eveningTime.setHours(eveningTime.getHours() + HOW_LONG_HRS);
    schedule.rescheduleJob(eveningTurnOff, eveningTime);

    if (eveningTurnOn !== null) {
        _('Next evening turn on job is set on: ' + eveningTurnOn.nextInvocation());
    }
    if (eveningTurnOff !== null) {
        _('Next evening turn off job is set on: ' + eveningTurnOff.nextInvocation());
    }
};

setEveningTiming();

let morningTurnOn = schedule.scheduleJob('1 5 * * *', function () {
    _('Activating the lights in the morning');
    changeState(true, "");
});
let morningTurnOff = schedule.scheduleJob('32 6 * * *', function () {
    _('Turning off the lights in the morning');
    changeState(false, "");
    setEveningTiming();
});

_('todo list RESTful API server started on: ' + port);

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
    let makeResponse = answer => {
        if (typeof res !== 'undefined' && res !== null && res !== "") {
            res.end(answer);
        }
    };

    exec(stateString, function (error, stdout, stderr) {
        _('stdout: ' + stdout);
        _('stderr: ' + stderr);
        if (error !== null) {
            _('exec error: ' + error);
            makeResponse(NEGATIVE_RESPONSE);
        } else {
            makeResponse(POSITIVE_RESPONSE);
        }
    });
};

function changeState(state, res) {
    if (state) {
        setState("on", res);
    } else {
        setState("off", res);
    }
    _("Current state called: " + state);
}

const checkState = function (res) {
    executeCommand("state", res);
};

const getHostname = function (res) {
    executeCommand("hostname", res);
};

function executeCommand(command, res) {
    exec(command, function (error, stdout, stderr) {
        let response = "-1";
        _('stdout: ' + stdout);
        _('stderr: ' + stderr);
        if (error !== null) {
            _('exec error: ' + error);
        } else {
            response = stdout.toString();
        }
        _("Command result: " + response);
        res.end(response)
    });
}