const mongoose = require('mongoose');

async function check() {
    console.log("Checking Mongo connection...");
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/portfolioDB', {
            serverSelectionTimeoutMS: 5000
        });
        console.log("Connected to Mongo!");
        process.exit(0);
    } catch (e) {
        console.error("Connection failed:", e.message);
        process.exit(1);
    }
}

check();
