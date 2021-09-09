const jwt = require('jsonwebtoken');

const generateJWT = (uid, name, activo) => {

    return new Promise((resolve, reject) => {

        const payload = { uid, name, activo };

        //console.log('payload', payload)

        jwt.sign(payload, process.env.SECRETJWT, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        }, (err, token) => {


            if (err) {
                console.log(err)
                reject('No se pudo generar el token')

            }

            resolve(token);

        })


    })
}

const generateJWTForgetPassword = (uid) => {

    return new Promise((resolve, reject) => {

        const payload = { uid }

        jwt.sign(payload, process.env.SECRETJWT_FORGET_PASSWORD, {
            expiresIn: process.env.CADUCIDAD_TOKEN_FORGET_PASSWORD
        }, (err, token) => {

            if (err) {
                console.log(err)
                reject('No se pudo generar el token')

            }

            resolve(token);
        })

    })
}


module.exports = {
    generateJWT,
    generateJWTForgetPassword,
}