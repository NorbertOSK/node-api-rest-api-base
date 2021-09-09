//Configuración Basica de Express
const express = require('express');
const logger = require('./services/logging')
const cors = require('cors');
//require('./src/config/environments') //configuración Produccion/Dev

const app = express();

//Morgan
const morgan = require('morgan');

app.use(morgan('short', {
    stream: {
        write: message => logger.info(message.trim())
    }
}))


//Middlewares
app.use(cors()) //cada vez que llegue una peticion al server, va a permitir, enviar y recibir datos

app.use(express.static('public')); //Directorio Publico //no debería ser necesario ya que la API, no debe renderizar Front


//Mi Server entiende json
//Lectura y Parseo de Body
app.use(express.json()); 

//Routes (agragar otros enrutadores)
app.use(require('./routes'))


module.exports = app;