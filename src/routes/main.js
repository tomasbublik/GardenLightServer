import express from 'express';
import IndexController from '../controller/index_controller';
import SunCalculatorController from '../controller/sun_calculator';
import SchedulerController from '../controller/scheduler_controller'
import ProcessService from '../services/process_service'
import SchedulerService from '../services/scheduler_service'

const processService = new ProcessService();
const schedulerService = new SchedulerService();
const schedulerController = new SchedulerController(schedulerService);
const router = express.Router();
const indexController = new IndexController();
const sunCalculatorController = new SunCalculatorController();

router.get('/', function (req, res) {
    indexController.get(req, res);
});

router.get('/suncalculator', function (req, res) {
    sunCalculatorController.get(req, res);
});

router.get('/scheduler', function (req, res) {
    schedulerController.get(req, res);
});

router.get('/on', function (req, res) {
    processService.changeState(true, res);
});

router.get('/onAsync', async (req, res) => {
    const response = await processService.setStateAsync("on");
    res.end(response);
});

router.get('/off', function (req, res) {
    processService.changeState(false, res);
});

router.get('/offAsync', async (req, res) => {
    const response = await processService.setStateAsync("off");
    res.end(response);
});

router.get('/state', function (req, res) {
    processService.checkState(res);
});

router.get('/stateAsync', async (req, res) => {
    const state = await processService.checkStateAsync();
    res.end(state);
});

router.get('/hostname', function (req, res) {
    processService.getHostname(res);
});

router.get('/hostnameAsync', async (req, res) => {
    const state = await processService.getHostnameAsync();
    res.end(state);
});


module.exports = router;
