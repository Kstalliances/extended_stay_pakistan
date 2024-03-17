const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({path: "backend/config.env"});

class Database {
    constructor() {
        console.log()
        this._connect();
    }

    _connect() {
        mongoose
            .connect(process.env.DATABASE_URL, {
                useUnifiedTopology: true,
            })
            .then(() => {
                console.log('CONNECTED TO MONGODB');
            })
            .catch((error) => {
                console.error('MONGODB CONNECTION ERROR:', error);
            });
    }
}

module.exports = new Database();
