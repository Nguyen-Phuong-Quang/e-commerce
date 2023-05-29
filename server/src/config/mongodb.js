const mongoose = require("mongoose");
const config = require("./config");

mongoose.connection.on("connected", () => {
    console.log("DB connected...!");
});

mongoose.connection.on("disconnected", () => {
    console.log("DB disconnected ...x...x...x...!");
});

module.exports = async function connectMongoDb() {
    try {
        await mongoose.connect(config.db.mongo_db_uri);
    } catch (err) {
        console.log(err);
    }
};
