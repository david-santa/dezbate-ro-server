const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient

const connectionString = "mongodb+srv://admin:admin@dezbatero.xrpsr.mongodb.net/test?authSource=admin&replicaSet=atlas-x3jw5l-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"

let db;
let topics;

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
      db = client.db('dezbate-ro')
      topics = db.collection('topics');
  })
  .catch(error => console.error(error))

app.listen(3000,function(){
    console.log('listening on 3000');
});

app.use((error, req, res, next) => {
    console.warn(error);
})

/**
 * TOPICS CRUD
 */

/**
 * TOPICS GET ALL
 */
app.get("/topics",
    function(req,res,next){
        topics.find().toArray().then(result=>
            res.status(300).json({"message":result})
        );
})

app.get("/topics/:id",
    function(req,res,next){
        db.collection()
    })