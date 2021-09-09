const {Router} = require('express')
const router = Router();

//Importo Rutas
const users = require('../src/apiServices/users/routes')

//Rutas
router.use('/api/v1/users', users)

module.exports = router