const logger = require('../../../../services/logging')

const findUSer = async (Model, email) => {

    const user = await Model.findOne({ email })
    if (!user) {
        logger.info(`Email [${email}] no existe. No puede iniciar sesion`)
        return res.status(400).json({
            ok: false,
            msg: `El usuario no existe para el mail ${email}`
        })
    }

    return user
}

module.exports = {
    findUSer
}

//no lo utilizo, porque a  la alrga es lo mismo