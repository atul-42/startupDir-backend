
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://startup-dir:stdir123@cluster0.omz3ic1.mongodb.net/';
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

