import 'babel-core/register';
import 'babel-polyfill';
import express from 'express';
import routes from './routes/main';
import path from 'path';
import exphbs from 'express-handlebars';
import logger from './services/log'

const port = process.env.PORT || 3001;

let app = express();

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', exphbs({defaultLayout: 'main', extname:'.html',
    layoutsDir:  path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials')
}));

app.use('/', routes);

app.listen(port, function () {
    logger.log('Home IOT Garden lights server started');
});
