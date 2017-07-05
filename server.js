const urlExists = require('url-exists');
const express = require('express');

const db = require('./lib/MongoDB.js');

const app = express();

app.use(express.static('public'));

app.get('/new/*', function (request, response) {
  const URLParam = request.url.replace('/new/','').toString();
  
  urlExists(URLParam, (err, exist) => {
    if (err || !exist) return response.send('Wrong url format, make sure you have a valid protocol and real site.');
    
    db.storeURL(URLParam)
    .then(writeResult => {
      const original_url = writeResult.original_url;
      const short_url = 'https://url-shortener-microservice-codecamp.glitch.me/' + writeResult._id; //*home domain is hardcoded*
      
      response.send({
        original_url,
        short_url
      });
    })
    .catch(err => {
      response.sendFile(__dirname + '/views/index.html'); //homepage
    })
  })
});

app.get('*', function (request, response) {
  const URLParam = request.url.replace('/', '');
  
  // check if the urlparam is not db document id
  if (!/.{12}|[a-f0-9]{24}/.test(URLParam) && URLParam.length != 24) {
    return response.sendFile(__dirname + '/views/index.html'); //homepage
  }
  
  // try and find a document based on the params the user inputted
  db.findDocument(URLParam)
  .then(doc => {
    if (!doc) return response.sendFile(__dirname + '/views/index.html'); //homepage
    
    // redirect user to the correct URL
    response.redirect(doc.original_url);
  })
  .catch(err => {
    response.sendFile(__dirname + '/views/index.html'); //homepage
  })
});

const listener = app.listen(process.env.PORT);
