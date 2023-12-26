
const express = require('express');
const cors = require('cors');
const { connectDB, closeDBConnection } = require('./database');
const apiRouter = require('./routes');

const app = express();
const port = 3001;

// app.use(cors({ origin: 'http://localhost:5173' }));
app.use(cors({ origin: '*' }));

app.use('/api', apiRouter);
// app.use(express.json());

connectDB();


process.on('SIGINT', async () => {
  await closeDBConnection();
  process.exit(0);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
