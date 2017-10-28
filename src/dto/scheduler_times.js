export default class SchedulerTimes {

    constructor(morningTurnOnTime = '', morningTurnOffTime = '', eveningTurnOnTime = '', eveningTurnOffTime = '') {
        this.morningTurnOnTime = morningTurnOnTime;
        this.morningTurnOffTime = morningTurnOffTime;
        this.eveningTurnOnTime = eveningTurnOnTime;
        this.eveningTurnOffTime = eveningTurnOffTime;
    }
}