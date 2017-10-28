import logger from '../services/log'
import ProcessService from '../services/process_service'
import SchedulerTimes from '../dto/scheduler_times';

let dateFormat = require('dateformat');
let schedule = require('node-schedule');
let SunCalc = require('suncalc');

const processService = new ProcessService();

const HOSIN_LATITUDE = 49.037303;
const HOSIN_LONGITUDE = 14.475924;
const ABSOLUTELY_FAR_AWAY_DATE = new Date(2042, 11, 21, 5, 30, 0);
const HOW_LONG_HRS = 2;
const DATE_FORMAT = "dd.mm.yyyy, HH:MM:ss";

let eveningTurnOn;
let eveningTurnOff;
let morningTurnOn;
let morningTurnOff;

export default class SchedulerService {

    constructor() {
        logger.log('Initializing scheduler service');
        eveningTurnOn = schedule.scheduleJob(ABSOLUTELY_FAR_AWAY_DATE, function () {
            logger.log('Activating the lights in the evening');
            processService.changeState(true, "");
        });

        eveningTurnOff = schedule.scheduleJob(ABSOLUTELY_FAR_AWAY_DATE, function () {
            logger.log('Deactivating the lights in the evening');
            processService.changeState(false, "");
        });
        setEveningTimings();
        morningTurnOn = schedule.scheduleJob('1 5 * * *', function () {
            logger.log('Activating the lights in the morning');
            processService.changeState(true, "");
        });
        morningTurnOff = schedule.scheduleJob('32 6 * * *', function () {
            logger.log('Turning off the lights in the morning');
            processService.changeState(false, "");
            setEveningTimings();
        });
        if (morningTurnOn !== null) {
            logger.log('Next morning turn on job is set on: ' + morningTurnOn.nextInvocation());
        }
        if (morningTurnOff !== null) {
            logger.log('Next morning turn off job is set on: ' + morningTurnOff.nextInvocation());
        }
    }

    provideTimings() {
        //return "Here I'll return the timings I'm aware of"
        let schedulerTimes = new SchedulerTimes();
        schedulerTimes.morningTurnOnTime = dateFormat(morningTurnOn.nextInvocation(), DATE_FORMAT);
        schedulerTimes.morningTurnOffTime = dateFormat(morningTurnOff.nextInvocation(), DATE_FORMAT);
        schedulerTimes.eveningTurnOnTime = dateFormat(eveningTurnOn.nextInvocation(), DATE_FORMAT);
        schedulerTimes.eveningTurnOffTime = dateFormat(eveningTurnOff.nextInvocation(), DATE_FORMAT);
        return schedulerTimes;
    }
}

let setEveningTimings = function () {
    let times = SunCalc.getTimes(new Date(), HOSIN_LATITUDE, HOSIN_LONGITUDE);
    let eveningTime = times.dusk;

    logger.log("Dusk time is: " + eveningTime);
    //eveningTime.setHours(eveningTime.getHours());
    schedule.rescheduleJob(eveningTurnOn, eveningTime);

    eveningTime.setHours(eveningTime.getHours() + HOW_LONG_HRS);
    schedule.rescheduleJob(eveningTurnOff, eveningTime);

    if (eveningTurnOn !== null) {
        logger.log('Next evening turn on job is set on: ' + eveningTurnOn.nextInvocation());
    }
    if (eveningTurnOff !== null) {
        logger.log('Next evening turn off job is set on: ' + eveningTurnOff.nextInvocation());
    }
};