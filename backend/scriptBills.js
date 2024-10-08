const express = require('express');
const mongoose = require('mongoose');
const bill = require('./modelBill');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectionString = 'mongodb+srv://'+process.env.USER+':'+process.env.PASSWORD+'@mongodb-wt.rmne2.mongodb.net/btech_cse_116';
mongoose.connect(connectionString).then(() => {
  console.log("Connected");
  const app = express();
  app.use(express.json());
  app.use(bodyParser.urlencoded());
  app.use(cors());
  app.get('/sales', async (req, res) => {
    const ans = await bill.find();
    res.json(ans);
  });
  app.get('/sales/:id', async (req, res) => {
    const ans = await bill.findOne({ No: req.params.id });
    res.json(ans);
  });
  app.post('/sales/bill', async (req, res) => {
    const newItem = new bill({ ...req.body });
    await newItem.save();
    res.json({ message: 'Bill created successfully' });
  });
  app.delete('/sales/:id', async (req, res) => {
    const result = await bill.findOneAndDelete({ No: req.params.id });
    if (result) {
      res.json({ message: 'Bill deleted successfully!' });
    }
    else {
      res.json({ message: 'Bill not found!' });
    }
  });
  app.post('/sales/:id', async (req, res) => {
    const { deletedNo } = req.body;
    await bill.updateMany(
      { No: { $gt: deletedNo } },
      { $inc: { No: -1 } }
    );
    const updatedItems = await bill.find().sort({ No: 1 });
    res.json(updatedItems);
  });

  app.listen(process.env.PORTSALES, () => {
    console.log("Server started @ "+process.env.PORTSALES);
  });
});