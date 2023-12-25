
const express = require('express');
const { getDatabase, closeDBConnection } = require('./database');
const importData = require('./import-data');

const router = express.Router();

router.use(express.json());


router.get('/import-data', async (req, res) => {
    try {
        await importData();
        res.send('Data import initiated. Check console for details.');
    } catch (error) {
        console.error('Error during data import:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/data', async (req, res) => {
    try {
      const { industry, search, page, pageSize } = req.query;

      const database = getDatabase();
      const collection = database.collection('startupDetails');
  
      // Building query based on filter and search criteria
      const query = {};
      if (industry) {
        query.IndustryVertical = industry;
      }
      if (search) {
        query.$or = [
          { StartupName: { $regex: search, $options: 'i' } },
          { IndustryVertical: { $regex: search, $options: 'i' } },
        ];
      }

      // Performing pagination
      const skip = (page - 1) * pageSize;
      const data = await collection.find(query).skip(skip).limit(Number(pageSize)).toArray();
      const totalItems = await collection.countDocuments(query);
      const totalPages = Math.ceil(totalItems / pageSize);
      
      res.json({ items: data, totalPages });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  router.post('/submit-startup', async (req, res) => {
    try {
      const { StartupName, CityLocation, Date, InvestorsName, IndustryVertical, employees, AmountInUSD } = req.body;
  
      const database = getDatabase();
      const collection = database.collection('startupDetails');
  
      const startupData = {
        StartupName,
        CityLocation,
        Date,
        InvestorsName,
        IndustryVertical,
        employees,
        AmountInUSD
      };
  
      const result = await collection.insertOne(startupData);
      // console.log(result)
      res.json({ success: true, message: 'Startup submitted successfully!' });
    } catch (error) {
      console.error('Error submitting startup:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });


  module.exports = router;