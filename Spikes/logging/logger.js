const winston = require("winston");

const level = process.env.LOG_LEVEL || 'debug';

// const logger = new winston.Logger({
//     transports: [
//         new winston.transports.Console({
//             level: level,
//             timestamp: function () {
//                 return (new Date()).toISOString();
//             }
//         })
//     ]
// });

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      ),
    transports: [
        new winston.transports.Console({
            level: level,
            timestamp: function () {
                return (new Date()).toISOString();
            }
        })
    ]
});

logger.info(`From winston, process.env.LOG_LEVEL: ${process.env.LOG_LEVEL}`);

module.exports = logger