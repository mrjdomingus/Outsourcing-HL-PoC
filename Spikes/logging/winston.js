const express = require('express'),
    morgan = require('morgan'),
    logger = require('./logger');


const PORT = 3000;

const app = express();

app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode < 400
    },
    stream: process.stderr
}));

app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode >= 400
    },
    stream: process.stdout
}));

app.get('/', function (req, res) {
    logger.debug('Debug statement');
    logger.info('Info statement');
    res.send('Hello World!');
});

app.use(function (req, res, next) {
    logger.error('404 page requested');
    res.status(404).send('This page does not exist!');
});

app.listen(PORT, function () {
    logger.info('Example app listening on port ' + PORT);
});