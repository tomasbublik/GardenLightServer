import SchedulerService from '../src/services/scheduler_service'

describe('SchedulerService', function() {
    const schedulerService = new SchedulerService();
    it('Should have proper dusk time when scheduler service is created', function () {
        let schedulerTimes = schedulerService.provideTimings();
        assert(schedulerTimes);
        //expect(schedulerTimes.eveningTurnOnTime).to.b;
    });
});