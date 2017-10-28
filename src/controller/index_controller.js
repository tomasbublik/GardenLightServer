let ip = require('ip');

export default class IndexController {

    get(req, res) {
        let viewData = {ip: ip.address()};
        res.render('index', viewData);
    }
}