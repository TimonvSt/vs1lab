// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const store = new GeoTagStore();

// add geotag examples
const GeoTagExamples = require("../models/geotag-examples");
for (const [name, latitude, longitude, hashtag] of GeoTagExamples.tagList) {
  store.add(new GeoTag(name, latitude, longitude, hashtag));
}


/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', {
    taglist: []
  })
});


// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */
router.get('/api/geotags', (req, res) => {
  const { searchterm, latitude, longitude, page = 1, limit = 6 } = req.query;
  let tags;
  if (searchterm) {
    tags = store.searchByName(searchterm);
  } else if (latitude && longitude) {
    tags = store.searchNearby(parseFloat(latitude), parseFloat(longitude), 5);
  } else {
    tags = store.getAll();
  }
  // Pagination
  const lastPage = Math.ceil(tags.length/limit);
  let serverPage = page;
  if (lastPage < page) {
    serverPage = lastPage;
  }
  let result = {serverPage, lastPage, limit};
  const startIndex = (serverPage - 1) * limit;
  const endIndex = serverPage * limit;
  result.tagList = tags.slice(startIndex, endIndex);

  res.json(result);
});


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */
router.post('/api/geotags', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;
  if (!name || !latitude || !longitude || !hashtag) {
    return res.status(400).send('All fields are required.');
  }
  const newTag = new GeoTag(name, parseFloat(latitude), parseFloat(longitude), hashtag);
  store.add(newTag);
  res.status(201).json(newTag);
});


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */
router.get('/api/geotags/:id', (req, res) => {
  const tag = store.getById(req.params.id);
  if (tag) {
    res.json(tag);
  } else {
    res.status(404).send('GeoTag not found.');
  }
});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */
router.put('/api/geotags/:id', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;
  const updatedTag = new GeoTag(name, parseFloat(latitude), parseFloat(longitude), hashtag);
  const success = store.update(req.params.id, updatedTag);
  if (success) {
    res.json(updatedTag);
  } else {
    res.status(404).send('GeoTag not found.');
  }
});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */
router.delete('/api/geotags/:id', (req, res) => {
  const success = store.delete(req.params.id);
  if (success) {
    res.status(204).send();
  } else {
    res.status(404).send('GeoTag not found.');
  }
});

module.exports = router;
