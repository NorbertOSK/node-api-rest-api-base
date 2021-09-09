const logger = require('../../services/logging')

module.exports = (req, res, next) => {
    let id = req.params.id
    //regex
    if (id.match(/^[a-fA-f0-9]{24}$/) === null) {
        res.status(400).json({
            ok: false,
            msg: `El id ${id} Suministrado no es Valido`
        })
        logger.error(`El id [${id}] no es valido, no existe.`)
        return
    }
    next()
}