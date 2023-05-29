const dotenv = require('dotenv');
dotenv.config();


const config = {
    server: {
        port: process.env.PORT
    },
    db: {
        mongo_db_uri: process.env.MONGO_DB_URI,
    },
    jwt: {
        jwt_secret: process.env.JWT_SECRET,
        jwt_access_expiration_minutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
        jwt_refresh_expiration_days: process.env.JWT_REFRESH_EXPIRATION_DAYS,
        jwt_reset_password_expiration_minutes: process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        jwt_verify_email_expiration_minutes: process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
    },
    email: {
        email_host: process.env.EMAIL_HOST,
        email_host_pass: process.env.EMAIL_HOST_PASS,
    },
    cloudinary: {
        name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET,
        project: process.env.CLOUD_PROJECT
    }
}

module.exports = config;
