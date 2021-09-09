const Joi = require('joi')
const logger = require('../../../services/logging')

function validateUser(req, res, next) {
    // create schema object
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(100).required()
    });

    // schema options
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };

    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);
    
    if (error) {
        // on fail return comma separated errors
        //next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        let validationErrors = error.details.reduce((acumulador, error) => {
            return acumulador + `[${error.message}]`
        }, "")
        logger.info("Usuario no puedo ser validado", error.details.map(error => error.message))
        res.status(400).json({
            ok: false,
            msg: 'Tu usuario no cumple los reuisitos, contraseña debe ser minimo de 8 caractares',
            erroresDeValidacion: validationErrors
        })
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
}


function validationOrderOfLogin(req, res, next) {
    // create schema object
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(100).required()
    });

    // schema options
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };

    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);
    
    if (error) {
        // on fail return comma separated errors
        //next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        let validationErrors = error.details.reduce((acumulador, error) => {
            return acumulador + `[${error.message}]`
        }, "")
        logger.info("Usuario no puede iniciar sesion", error.details.map(error => error.message))
        res.status(400).json({
            ok: false,
            msg: `Login fallo. debes especificar email y contraseña de usuario`,
            erroresDeValidacion: validationErrors
        })
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
}

function validateResetPassword(req, res, next) {
    // create schema object
    const schema = Joi.object({
        newPassword: Joi.string().min(8).max(100).required(),
        resetLink: Joi.string().required()

    });

    // schema options
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };

    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);
    
    if (error) {
        // on fail return comma separated errors
        //next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        let validationErrors = error.details.reduce((acumulador, error) => {
            return acumulador + `[${error.message}]`
        }, "")
        logger.info("Error al cambiar la contraseña", error.details.map(error => error.message))
        res.status(400).json({
            ok: false,
            msg: `Tu contraseña no cumple los requisitos, contraseña debe ser minimo de 8 caractares`,
            erroresDeValidacion: validationErrors
        })
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
}

module.exports = {
    validationOrderOfLogin,
    validateUser,
    validateResetPassword
}