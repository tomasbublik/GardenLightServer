let SunCalc = require('suncalc');
let dateFormat = require('dateformat');

const HOSIN_LATITUDE = 49.037303;
const HOSIN_LONGITUDE = 14.475924;
const DATE_FORMAT = "dd.mm.yyyy, HH:MM:ss";

export default class SunCalculatorController {

    get(req, res) {
        let times = SunCalc.getTimes(new Date(), HOSIN_LATITUDE, HOSIN_LONGITUDE);
        let viewData = {
            solarNoon: dateFormat(times.solarNoon, DATE_FORMAT),
            nadir: dateFormat(times.nadir, DATE_FORMAT),
            sunrise: dateFormat(times.sunrise, DATE_FORMAT),
            sunset: dateFormat(times.sunset, DATE_FORMAT),
            sunriseEnd: dateFormat(times.sunriseEnd, DATE_FORMAT),
            sunsetStart: dateFormat(times.sunsetStart, DATE_FORMAT),
            dawn: dateFormat(times.dawn, DATE_FORMAT),
            dusk: dateFormat(times.dusk, DATE_FORMAT),
            nauticalDawn: dateFormat(times.nauticalDawn, DATE_FORMAT),
            nauticalDusk: dateFormat(times.nauticalDusk, DATE_FORMAT),
            nightEnd: dateFormat(times.nightEnd, DATE_FORMAT),
            night: dateFormat(times.night, DATE_FORMAT),
            goldenHourEnd: dateFormat(times.goldenHourEnd, DATE_FORMAT),
            goldenHour: dateFormat(times.goldenHour, DATE_FORMAT)
        };
        res.render('sun_calc', viewData);
    }
}