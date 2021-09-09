const usersCtrl = {};
const config = require('config')
const jwt = require('jsonwebtoken');
const emails = require('./emails.json')

const { generateJWT, generateJWTForgetPassword} = require('../../helpers/jwt'); //para generar token
const sendEmailFun = require('../../../services/email');
const  User  = require('./model');
const logger = require('../../../services/logging');


//GET obtener Usuarios
usersCtrl.getUsers = async (req, res) => {

    const queryActivo = req.query.active

    const users = await User.find({ active: queryActivo }) //solo recibe los user activos

    //console.log('query',req.query)
    //console.log('params',req.params)
    //console.log('headers', req.headers)

    res.json({
        ok: true,
        users
    })
    logger.info('Ruta de Prueba para ver todos los usuarios')
}


//POST Crear Usuario
usersCtrl.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //Verifico email duplicado
        const verifyDuplicateEmail = await User.findOne({ email })

        if (verifyDuplicateEmail) {
            logger.info(`Email Duplicado [${email}]`)
            return res.status(400).json({
                ok: false,
                msg: `El Correo ya fue registrado`
            })
        }

        //Instancia de usuario nuevo
        const newUser = new User({
            name,
            email,
            password
        })

        //Crifro password
        newUser.password = await newUser.encryptPassword(newUser.password)

        //Guardo Usuario en DB
        await newUser.save();


        //Genero JWT
        const token = await generateJWT(newUser._id, newUser.name, newUser.active);
        //console.log('nuevoUsuario.activo', newUser.active)

        res.status(200).json({
            ok: true,
            uid: newUser._id,
            name: newUser.name,
            token
        })
        logger.info(`Usuario creado exitosamente para el usuario [${newUser.email}]`)

        //Envio Correo Electrónico
        sendEmailFun(email, emails.createUser.subject, emails.createUser.message)

    } catch (err) {
        logger.error(err)
        res.status(500).json({
            ok: false,
            msg: 'Error interno en el Servidor'
        })
    }
}

//POST Login de Usuario
usersCtrl.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Busco user
        const user = await User.findOne({ email })
        if (!user) {
            logger.info(`Email [${email}] no existe. No puede iniciar sesion`)
            return res.status(400).json({
                ok: false,
                msg: `El usuario no existe para el mail ${email}`
            })
        }




        //Si existe, Validamos Contraseña
        const validatePassword = await user.validatePassword(password)
        //console.log('validar password es', validarPassword)
        if (!validatePassword) {
            logger.info(`Contraseña incorrecta para iniciar sesion con el email [${email}]`)
            return res.status(400).json('Contraseña Incorrecta') //si uso 401 me redifige la web
        }

        //Generar JWT
        const token = await generateJWT(user._id, user.name, user.activo);

        res.status(200).json({
            ok: true,
            uid: user._id,
            name: user.name,
            token
        })
        logger.info('Sesion iniciada exitosamente')

    } catch (err) {
        logger.error(err)
        res.status(500).json({
            ok: false,
            msg: 'Error interno en el Servidor'
        })
        //console.log('error login', err)
    }
}

//ResetPassword (ruta que genera enlace para resetar contraseña)
usersCtrl.forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        //busco email de usuario
        const infoUser = await User.findOne({ email })

        if (!infoUser) {
            logger.info(`No se ha encontrado un usuario con email [${email}]`)
            return res.status(404).json({
                ok: false,
                msg: `Error, el email es Invalido`
            })
        }

        //console.log(infoUser._id)

        //Genero token para guardar en modelo
        const token = await generateJWTForgetPassword(infoUser._id)
        //console.log(token)

        

        
        //Guardo Token en info de perfil de Usuario
        await infoUser.updateOne({resetLink: token})

        res.status(200).json({ //respondo esto o un "ok, actualizado?"
            ok: true,
            msg: 'Un correo ha sido enviado con instrucciones para resstablecer su contraseña'
        })
        logger.info(`Se envio correo a [${email}], para el user.id [${infoUser._id}] para Resetear la Contarseña`)

        //Envio Correo Electrónico
        const messageBody = `<p>Ingrese al siguiente enlace para resetear la contraseña</p>
        <p>Solo dispone de 10 minutos para resetear su contraseña, o deberá volver a generar el proceso de reseteo.</p>
        <a href="${config.get('server.domainFront')}/${token}">Igrese Aqui</p></a>
        <p>Gracias</p>
        `
        sendEmailFun(email, emails.forgetPassword.subject, messageBody)

    } catch (err) {
        logger.error(err)
        res.status(500).json({
            ok: false,
            msg: 'Error interno en el Servidor'
        })
    }

}


//ResetPassword (endpoint que recibe contraseña nueva y actualiza)
usersCtrl.resetPassword = async (req, res) => {    

    try {

        //Recibo parametros del body
        //resetLink debería ser un input oculto del from que envia el token que se encuentra en la URL   
        const {resetLink, newPassword} = req.body

        if (!resetLink) {
            logger.info(`Error de Autenticación, No se ha recibido el [resetLink]`)
            return res.status(401).json({
                ok: false,
                msg: `Error de Autenticación`
            })
        }         
        
        //Decodifico data de token 
        const tokenDecoded = await jwt.verify(resetLink, process.env.SECRETJWT_FORGET_PASSWORD, (error, decodedData) => {
            if(error){
                //console.log('error', error.message)
                logger.info(`Token Invalido, o Expirado: Error [${error.message}]`)
                return res.status(401).json({
                    ok: false,
                    msg: `Error de Autenticación, vuelva a solicitar el reseteo de la Contraseña`
                })
            }

            //console.log('data', decodedData)
            return decodedData
        })
        
        //Guardo ID de Usuario
        const idUser = tokenDecoded.uid
        //console.log('idusuario', idusuario)

        //Busco usuario con el ID de la decodificación
        const user = await User.findById({_id: idUser})
        if (!user) {
            logger.info(`No existe Usuario con Este Token`)
            return res.status(400).json({
                ok: false,
                msg: `No existe Usuario con Este Token`
            })
        }

        //esto por si hay intento de login cuando el user no lo solicito
        if(user.resetLink !== resetLink){
            logger.info(`Intento de cambio de contraseña con con el campo [restLInk] vacio`)
            return res.status(400).json({
                ok: false,
                msg: `Usted no ha solicitado cambiar la contraseña`
            })
        }


        //Crifro password
        const encryptedPassword = await user.encryptPassword(newPassword)
        //console.log(passCifrada)

        //Actualizo password cifrado
        await user.updateOne({password: encryptedPassword})

        //Borro contenido de reSetLink
        await user.updateOne({resetLink: ''})
        

        res.status(200).json({ //respondo esto o un "ok, actualizado?"
            ok: true,
            msg: 'Su contraseña ha sido actualizada correctamente'
        })
        logger.info(`Se cambio la contraseña para el user con ID [${idUser}] correo [${user.email}]`)

        //Envio Correo Electrónico
        sendEmailFun(user.email, emails.resetPassword.subject, emails.resetPassword.message)


    } catch (err) {
        logger.error(err)
        res.status(500).json({
            ok: false,
            msg: 'Error interno en el Servidor'
        })
    }

}

//PUT Modificar un Usuario
usersCtrl.updateUser = async (req, res) => {

    try {

        const id = req.params.id

        const user = await User.findById(id)


        if (!user) {
            logger.info(`No se ha encontrado el Usuario con id [${id}]`)
            return res.status(404).json({
                ok: false,
                msg: `El usuario no existe`
            })

        }


        const { name, email } = req.body //desde req.body extraigo estos datos
        await User.findByIdAndUpdate(id, {
            name,
            email
        })

        //Generar JWT = es necesario?
        const token = await generateJWT(user._id, user.name);

        res.status(200).json({ //respondo esto o un "ok, actualizado?"
            ok: true,
            uid: user._id,
            name: user.name,
            token
        })
        logger.info(`Usuario con ID [${id}], ha sido actualizado!`)

    } catch (err) {
        logger.error(err)
        res.status(500).json({
            ok: false,
            msg: 'Error interno en el Servidor'
        })
    }

}

//DELETE Usuario
usersCtrl.deleteUser = async (req, res) => {
    try {

        const id = req.params.id

        const user = await User.findById(id)

        if (!user) {
            logger.info(`No se ha encontrado el usuario con id [${id}]`)
            return res.status(404).json({
                ok: false,
                msg: `El usuario no existe`
            })
        }


        await User.findByIdAndDelete(user)

        res.status(205).json({
            ok: true,
            msg: 'Usuario Eliminado'
        });
        logger.info(`Usuario con id [${id}] fue borrado exitosamente!`)

    } catch (err) {
        logger.error(err)
        res.status(500).json({
            ok: false,
            msg: 'Error interno en el Servidor'
        })
    }
}

//Revalidar Token
usersCtrl.revalidateToken = async (req, res) => {
    const { uid, name, activo } = req;


    //console.log(req)
    //console.log(req.params.id)

    ///Generar JWT
    const token = await generateJWT(uid, name, activo);

    //console.log('se solicito el /')
    res.json({
        ok: true,
        uid,
        name,
        token
    });
}


module.exports = usersCtrl;