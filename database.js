
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');


const envPath = path.resolve(__dirname, 'config.env');

dotenv.config({ path: envPath });

const uri = process.env.DATABASE;
const client = new MongoClient(uri);

let database;
async function connectDB() {
    await client.connect();
    database = client.db('startupDB');
}

async function closeDBConnection() {
    await client.close();
}


module.exports = { connectDB, closeDBConnection, getDatabase: () => database };

