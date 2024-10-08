const express = require('express');
const mongoose = require('mongoose');
const electronics = require('./modelStock');
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
  app.get('/stock', async (req, res) => {
    const ans = await electronics.find();
    res.send(ans);
  });
  app.post('/modifyStock', async (req, res) => {
    const newItem = new electronics({ ...req.body });
    await newItem.save();
    res.json({ message: 'Stock added successfully' });
  });
  app.put('/modifyStock/:id', async (req, res) => {
    const updatedFields = req.body;
    const result = await electronics.findOneAndUpdate(
      { No: req.params.id },
      { $set: updatedFields },
      { new: true }
    );
    if (result) {
      res.json({ message: 'Stock modified successfully!' });
    }
    else {
      res.json({ message: 'Stock not found!' });
    }
  });
  app.delete('/stock/:id', async (req, res) => {
    const result = await electronics.findOneAndDelete({ No: req.params.id });
    if (result) {
      res.json({ message: 'Stock deleted successfully!' });
    }
    else {
      res.json({ message: 'Stock not found!' });
    }
  });
  app.post('/stock/:id', async (req, res) => {
    const { deletedNo } = req.body;
    await electronics.updateMany(
      { No: { $gt: deletedNo } },
      { $inc: { No: -1 } }
    );
    const updatedItems = await electronics.find().sort({ No: 1 });
    res.json(updatedItems);
  });

  app.listen(process.env.PORTSTOCK, () => {
    console.log("Server started @ "+process.env.PORTSTOCK);
  });
});