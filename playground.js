let SunCalc = require('suncalc');
let schedule = require('node-schedule');

const HOSIN_LATITUDE = 49.037303;
const HOSIN_LONGITUDE = 14.475924;
const HOW_LONG_HRS = 2;
const TIMEZONE_SHIFT = 2;

const ABSOLUTELY_FAR_AWAY_DATE = new Date(2042, 11, 21, 5, 30, 0);
let eveningTurnOn = schedule.scheduleJob(ABSOLUTELY_FAR_AWAY_DATE, function () {
    console.log("Default evening turn on time");
});

let eveningTurnOff = schedule.scheduleJob(ABSOLUTELY_FAR_AWAY_DATE, function () {
    console.log("Default evening turn off time");
});

let setEveningTiming = function () {
    let times = SunCalc.getTimes(new Date(), HOSIN_LATITUDE, HOSIN_LONGITUDE);
    console.log(times);

    let eveningTime = times.dusk;
    console.log("Evening time is: " + eveningTime);
    console.log("Current time is: " + new Date());
    eveningTime.setHours(eveningTime.getHours());
    schedule.rescheduleJob(eveningTurnOn, eveningTime);

    eveningTime.setHours(eveningTime.getHours() + HOW_LONG_HRS);
    schedule.rescheduleJob(eveningTurnOff, eveningTime);

    if (eveningTurnOn !== null) {
        console.log('Next evening turn on job is set on: ' + eveningTurnOn.nextInvocation());
    }
    if (eveningTurnOff !== null) {
        console.log('Next evening turn off job is set on: ' + eveningTurnOff.nextInvocation());
    }
};
if (eveningTurnOn !== null) {
    console.log('Next evening turn on job is set on: ' + eveningTurnOn.nextInvocation());
}
if (eveningTurnOff !== null) {
    console.log('Next evening turn off job is set on: ' + eveningTurnOff.nextInvocation());
}
setEveningTiming();
