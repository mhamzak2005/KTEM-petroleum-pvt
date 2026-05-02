const { MongoClient } = require("mongodb");
const { DB_URL } = process.env;

// Create the client
const client = new MongoClient(DB_URL);

let dbConnection;

module.exports = {
    async getDbo() {
        if (!dbConnection) {
            await client.connect();
            dbConnection = client.db();
            console.log("✅ Native MongoDB Driver connected");
        }
        return dbConnection;
    }
};