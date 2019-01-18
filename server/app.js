const router = require('express').Router();
const express = require('express');
const path = require('path');
const fs = require('fs');
const formidable = require("formidable");


let createApp = function() {
  const app = express();
  return app;
}

router.get('/', function (req, res) {
    res.send("Hi. I am alive.")
});

router.post('/saveimage', function (req, res) {

  let form = formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    fs.readFile(files.file.path, 'binary', (readFileError, data) => {
      try {
        let buffer = new Buffer(data, 'binary');

        let img = {};
        let dir = './images/';
        img.data = buffer;
        img.contentType = files.file.type;

        let imagePath = dir + 'sample.jpeg';
        
        console.log('Image Path: ' + imagePath);

        fs.writeFile(imagePath, data, 'binary', function (writeFileError) {
            if(writeFileError) {
              throw writeFileError;
            }
        });

        res.send("image stored successfully.");
      } catch(err1) {
        logger.error(err1);
        res.status(500).json({
          error: 'Internal error occurred, please report...!'
        });
      }
    });
  });
});



let setupRestRoutes = function(app) {

  //  eg: app.use('/resource', require(path.join(__dirname, './module')));

  app.use('/', router);

  app.use(function (req, res) {
    let err = new Error('Resource not found');
    err.status = 404;
    return res.status(err.status).json({
      error: err.message
    });
  });

  app.use(function (err, req, res) {
    logger.error('Internal error in watch processor: ', err);
    return res.status(err.status || 500).json({
      error: err.message
    });
  });

  return app;
}

let setupMiddlewares = function(app) {
  const bodyParser = require('body-parser');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  return app;
}

module.exports = function () {

  let app = createApp();
  app = setupMiddlewares(app);
  app = setupRestRoutes(app);

  return app;
};
