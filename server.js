// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Create Express app
const app = express();

// Configure bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/pgapp', { useNewUrlParser: true });
const db = mongoose.connection;

// Define schema and model for properties collection
const propertySchema = new mongoose.Schema({
  name: String,
  location: String,
  rent: Number,
});

const Property = mongoose.model('Property', propertySchema);

// Define API routes
app.get('/api/properties', (req, res) => {
  Property.find((err, properties) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    } else {
      res.json(properties);
    }
  });
});

app.get('/api/properties/:id', (req, res) => {
  Property.findById(req.params.id, (err, property) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    } else if (!property) {
      res.status(404).send('Property not found');
    } else {
      res.json(property);
    }
  });
});

app.post('/api/properties', (req, res) => {
  const property = new Property({
    name: req.body.name,
    location: req.body.location,
    rent: req.body.rent,
  });

  property.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    } else {
      res.status(201).send('Property created successfully');
    }
  });
});

app.put('/api/properties/:id', (req, res) => {
  Property.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    location: req.body.location,
    rent: req.body.rent,
  }, (err, property) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    } else if (!property) {
      res.status(404).send('Property not found');
    } else {
      res.status(200).send('Property updated successfully');
    }
  });
});

app.delete('/api/properties/:id', (req, res) => {
  Property.findByIdAndDelete(req.params.id, (err, property) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    } else if (!property) {
      res.status(404).send('Property not found');
    } else {
      res.status(200).send('Property deleted successfully');
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
