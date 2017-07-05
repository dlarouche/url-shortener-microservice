const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const url = process.env.MONGOLAB_URI;


function storeURL(originalURL) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        return reject(Error('Unable to connect to the database. Error: ', err))
      }
      
      db.collection('urls').insert({ original_url: originalURL })
      .then(writeResult => {
        resolve(writeResult.ops[0]);
      })
      .then(db.close())
    })
  })
}

function findDocument(id) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        return reject(Error('Unable to connect to the database. Error: ', err))
      }
      
      db.collection('urls').findOne(mongodb.ObjectID(id))
      .then(resolve)
      .then(db.close())
    })
  })
}

module.exports = {
  storeURL,
  findDocument
}                  
