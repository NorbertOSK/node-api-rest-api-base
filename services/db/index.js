const config = require('config')
const mongoose = require('mongoose');
const logger = require('../logging')

const URI = config.get('mongoDb.urlDB');
//console.log('URI', URI)


const dbConnection = async () => {

    try {

        await mongoose.connect(URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                //useCreateIndex: true
            });

        console.log('DB Online')
        //logger.info('DB Conectada')

    } catch (error) {
        console.log(error)
        logger.error(error)
        throw new Error('Errro a la hora de inicializar DB')
    }
}

module.exports = {
    dbConnection
}