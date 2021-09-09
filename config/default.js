require('dotenv').config(); //Cargo variables de entorno

module.exports = {
    
    server: {
        port: 3000,
        domainFront: 'https://localhost:4000/', 
    },
        
    //db
    mongoDb: {
        urlDB: 'mongodb://localhost/testapi', 
    },

    //eamils
    email:{
        host: process.env.HOST_EMAIL_DEV,
        port: process.env.PORT_EMAIL_DEV,
        user: process.env.AUTH_USER_EMAIL_DEV,
        pass: process.env.AUTH_PASS_EMAIL_DEV,
    },

    //logger: 'dev'
}