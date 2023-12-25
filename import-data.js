
const fs = require('fs');
const parse = require('csv-parser');
const { MongoClient } = require('mongodb');

async function importData() {
    try {
        const uri = `mongodb+srv://startup-dir:stdir123@cluster0.omz3ic1.mongodb.net/`;
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const database = client.db('startupDB');
        const collection = database.collection('startupDetails');

        const data = [];

        fs.createReadStream('startup_funding.csv')
            .pipe(parse())
            .on('data', (row) => {
                data.push(row);
            })
            .on('end', async () => {
                await collection.insertMany(data);
                console.log('Data import complete.');
                client.close();
            })
            .on('error', (error) => {
                console.error('Error during data import:', error);
                client.close();
            });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = importData;
