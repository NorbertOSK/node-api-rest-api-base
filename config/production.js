require('dotenv').config(); //Cargo variables de entorno

module.exports = {
    
    server: {
        port: process.env.PORT || 8000,
        domainFront: process.env.DOMINIO_FRONT_PROD, 
    },
        
    //db
    mongoDb: {
        urlDB: process.env.MONGO_URI_PRO, 
    },

    //eamils
    email:{
        host: process.env.HOST_EMAIL_PRO,
        port: process.env.PORT_EMAIL_PRO,
        user: process.env.AUTH_USER_EMAIL_PRO,
        pass: process.env.AUTH_PASS_EMAIL_PRO,
    },

    //logger: 'dev'
}