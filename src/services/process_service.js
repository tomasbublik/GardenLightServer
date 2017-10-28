import logger from '../services/log'

const child = require('child_process');
const {promisify} = require('util');
const exec = promisify(child.exec);
const NEGATIVE_RESPONSE = "FAILED";
const POSITIVE_RESPONSE = "OK";

export default class ProcessService {
 
    changeState(state, res) {
        if (state) {
            setState("on", res);
        } else {
            setState("off", res);
        }
        logger.log("Current state called: " + state);
    }

    setStateAsync = async () => {
        return (async (stateString) => {
            try {
                const result = await exec(stateString);
                logger.log('stdout: ' + result.stdout);
                logger.log('exec error: ' + result.error);
                logger.log('stderr: ' + result.stderr);
                return (POSITIVE_RESPONSE);
            } catch (ex) {
                ex => console.error(error);
                return (NEGATIVE_RESPONSE);
            }
        })();
    };
    checkState = function (res) {
        executeCommand("state", res);
    };

    checkStateAsync = async () => {
        return await commandAsync("state");
    };

    getHostname = function (res) {
        executeCommand("hostname", res);
    };

    getHostnameAsync = async () => {
        return await commandAsync("hostname");
    };
}

const setState = function (stateString, res) {
    let makeResponse = answer => {
        if (typeof res !== 'undefined' && res !== null && res !== "") {
            res.end(answer);
        }
    };

    exec(stateString, function (error, stdout, stderr) {
        logger.log('stdout: ' + stdout);
        logger.log('stderr: ' + stderr);
        if (error !== null) {
            logger.log('exec error: ' + error);
            makeResponse(NEGATIVE_RESPONSE);
        } else {
            makeResponse(POSITIVE_RESPONSE);
        }
    });
};

let executeCommand = function (command, res) {
    exec(command, function (error, stdout, stderr) {
        let response = "-1";
        logger.log('stdout: ' + stdout);
        logger.log('stderr: ' + stderr);
        if (error !== null) {
            logger.log('exec error: ' + error);
        } else {
            response = stdout.toString();
        }
        logger.log("Command result: " + response);
        res.end(response)
    });
};

let commandAsync = async function (command) {
    return (async () => {
        try {
            const result = await exec(command);
            logger.log("Now log the result");
            logger.log(result.toString());
            return result.stdout;
        } catch (ex) {
            ex => console.error(error);
            return NEGATIVE_RESPONSE;
        }
    })();
};