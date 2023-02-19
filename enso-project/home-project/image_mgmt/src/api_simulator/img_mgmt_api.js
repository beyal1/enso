const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { paginateResults } = require('./utils');
const swaggerUi = require("swagger-ui-express");
const { check, validationResult } = require('express-validator');
const swaggerDocument = require('./swagger.json');

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const PORT = 4000;
app.use(bodyParser.json());

//const mongoUrl = process.env.MONGO_URI;
const mongoUrl = 'mongodb://mongodb:27017/docker-mongo';
process.env.SECRET = "JWT_TOKEN"

// Setup JWT authentication
app.use((req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET, (err, decode) => {
      if (err) {
        req.user = undefined;
      }
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

// Open session to MongoDB
if (typeof mongoUrl !== 'string') {
  throw new Error('MONGO_URI environment variable is not defined or is not a string');
}
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(`MongoDB connection error: ${err}`));

// Define  image creation schema
const ImageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  repository: { type: String, required: true },
  version: { type: String, required: true },
  metadata: { type: Object, required: false }
}, { timestamps: true });

// Define image deployment schema
const DeploymentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  imageId: { type: String, required: false }
}, { timestamps: true });

// Create image and deployment models

const Image = mongoose.model('Image', ImageSchema);
const Deployment = mongoose.model('Deployment', DeploymentSchema);

// Create / update image
app.post('/images/upsert', [
  // Validate the id parameter
  check('id').isString().withMessage('Id parameter must be a string'),
  // Validate the name parameter
  check('name').isString().withMessage('Name parameter must be a string'),
  // Validate the repository parameter
  check('repository').isString().withMessage('Repository parameter must be a string'),
  // Validate the version parameter
  check('version').isString().withMessage('Version parameter must be a string')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id, name, repository, version, metadata } = req.body;
  const update = { metadata: { ...req.body.metadata } };
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  const image = await Image.findOneAndUpdate({ id }, update, options);

  res.send(image);
});



// Route to retrieve images
app.get('/images', [
  // Validate the page parameter
  check('page').isInt({ min: 1 }).withMessage('Page parameter must be a positive integer'),
  // Validate the limit parameter
  check('limit').isInt({ min: 1 }).withMessage('Limit parameter must be a positive integer')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { page, limit } = req.query;
  const skipValue = (page - 1) * limit;

  try {
    const totalResults = await Image.countDocuments();
    const images = await Image.find()
        .skip(skipValue)
        .limit(parseInt(limit))
        .sort('-createdAt');

    return res.status(200).json({ images, totalResults });
  } catch (err) {
    console.log(`Error retrieving images: ${err.message}`);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/deployment/make',[
  // Validate the id parameter
  check('id').isInt({ min: 1 }).withMessage('Page parameter must be a positive integer'),
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id, imageId } = req.body;
  const deployment = await Deployment.create({ id, imageId });

  // Some fake deployment logic here
  const target = 'some_url.com'; // The target to deploy the image to
  console.log(`Deploying image with id ${imageId} to target ${target}...`);

  // Simulate deployment by waiting for 5 seconds
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log(`Image with id ${imageId} successfully deployed to target ${target}`);
  res.send(deployment);
});


app.get('/deployments', [
  // Validate the page parameter
  check('page').isInt({ min: 1 }).withMessage('Page parameter must be a positive integer'),
  // Validate the limit parameter
  check('limit').isInt({ min: 1 }).withMessage('Limit parameter must be a positive integer')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { page, limit } = req.query;
  const skipValue = (page - 1) * limit;

  try {
    const totalResults = await Deployment.countDocuments();
    const deployments = await Deployment.find()
        .skip(skipValue)
        .limit(parseInt(limit))
        .sort('-createdAt');

    return res.status(200).json({ deployments, totalResults });
  } catch (err) {
    console.log(`Error retrieving deployments: ${err.message}`);
    return res.status(500).json({ error: 'Server error' });
  }
});


// Expose Swagger/Open-API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//General route validator
app.get('/', (req, res) => {
  res.send('Image Mgmt API');
});


app.listen(PORT, () => {
  console.log('Server started on port 4000');
});





