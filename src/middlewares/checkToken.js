const jwt = require('jsonwebtoken')
const logger = require('../../services/logging')

const checkToken = async (req, res, next) => {

    //Recibo el JWT por header x-token
    const token = req.header('x-token');
    //console.log(token)

    //Si Token no existe
    if (!token) {
        logger.info('No hay token en la petición')
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }


    try {

        const { uid, name, activo } = await jwt.verify(
            token,
            process.env.SECRETJWT
        );

        //console.log('activo desde verify', activo)

        req.uid = uid;
        req.name = name;
        req.activo = activo


    } catch (error) {
        logger.error('Token Invalido')
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }


    next()


}

module.exports = checkToken;