const express = require('express'),
    morgan = require('morgan');

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
    res.send('Hello World!')
})

app.listen(PORT, function () {
    console.log('Example app listening on port ' + PORT);
});