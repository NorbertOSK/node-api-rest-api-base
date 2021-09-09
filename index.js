//Acceso a Configuración
const config = require('config')

//server
const app = require('./app');
const { dbConnection } = require('./services/db')

//DB
dbConnection();

//Puerto
const port = config.get('server.port')
app.set('port', port)
//console.log(port)

async function main() {
    await app.listen(port);
    console.log(`Server en Puerto ${port}`);
}

main()