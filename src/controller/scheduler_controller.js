let schedulerService;

export default class SchedulerController {

    constructor(schedulerService) {
        this.schedulerService = schedulerService;
    }

    get(req, res) {
        let viewData = {times: this.schedulerService.provideTimings};
        let timings = this.schedulerService.provideTimings();
        res.render('scheduler', timings);
    }
}