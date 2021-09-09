const winston = require('winston')
const moment = require('moment')

const addDate = winston.format((info) => {
    info.message = `${moment().format('DD-MM-YYYY HH:mm:ss')} ${info.message}`
    return info
})

module.exports = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),

        new winston.transports.File({
            level: 'info',
            handleExceptions: true,
            format: winston.format.combine(
                addDate(),
                winston.format.simple()
            ),
            maxsize: 5120000,
            maxFiles: 5,
            filename: `${__dirname}/../../logs/logs-de-aplicacion.log`
        })
    ]
})