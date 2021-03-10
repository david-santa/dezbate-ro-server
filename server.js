const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient

const connectionString = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false"

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('dezbate-ro')
    const topicsCollection = db.collection('topics')
    const cursor = topicsCollection.find().toArray().then(results=>{
        console.log(results);
    })
  })
  .catch(error => console.error(error))

app.listen(3000,function(){
    console.log('listening on 3000');
});