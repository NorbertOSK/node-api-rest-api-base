const mongoose = require('mongoose')
const moment = require('moment')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Usuario debe tener un Nombre'],
        trim: true, //elimina espacios
        tolowercase: true
    },
    email: {
        type: String,
        required: [true, 'Usuario debe tener un correo'],
        trim: true, //elimina espacios
        unique: true,
        tolowercase: true
    },

    fechaRegistro: {
        type: String,
        default: moment().format('DD-MM-YYYY'),
        //default: moment(Date.now())
    },

    password: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    resetLink: {
        type: String,
        default: ''
    }

}, {
    timestamps: true
})

//Elimino Password de la impresion del json
userSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}


//Cifro Contraseña

userSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

//Decifrar contraseña
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema, 'users')