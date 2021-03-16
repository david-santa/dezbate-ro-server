const express = require('express');
const app = express();
const mongo = require('mongodb')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')

const connectionString = "mongodb+srv://admin:admin@dezbatero.xrpsr.mongodb.net/test?authSource=admin&replicaSet=atlas-x3jw5l-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"

let db;
let topics;

MongoClient.connect(connectionString, {useUnifiedTopology: true})
    .then(client => {
        console.log('Connected to Database')
        db = client.db('dezbate-ro')
        topics = db.collection('topics');
    })
    .catch(error => console.error(error))

app.listen(3000, function () {
    console.log('listening on 3000');
});

app.use((error, req, res, next) => {
    console.warn(error);
})

/**
 * TOPICS CRUD
 */

app.use(bodyParser())

/**
 * TOPICS GET ALL
 */
app.get("/topics",
    function (req, res, next) {
        try {
            topics.find().toArray().then(result =>
                res.status(200).json({"message": result})
            );
        } catch (e) {
            res.status(404).json({"message": "something went wrong"});
        }
    })

/**
 * TOPICS GETBYID
 */

app.get("/topics/:id",
    function (req, res, next) {
        let id = req.params.id;
        try {
            topics.findOne({_id: mongo.ObjectId(id)}).then(result =>
                res.status(200).json({message: result}));
        } catch (e) {
            res.status(404).json({"message": "something went wrong"});
        }
    })

/**
 * TOPIC POST
 */

app.post("/topics",
    function (req, res, next) {
        try {
            topics.insertOne(req.body).then(result => {
                res.status(201).json({message: "created"})
            })
        } catch (e) {
            res.status(400).json({"message": "something went wrong"});
        }
    })

/**
 * TOPICS ADD A VIEW
 */

app.put("/topics/addview/:id",
    function (req, res, next) {
        let id = req.params.id;
        try {
            console.log(id);
            topics.findOneAndUpdate({_id: mongo.ObjectId(id)}, {$inc: {"views": 1}});
            res.status(200).json({"message": "updated"})
        } catch (e) {
            console.log(e)
            res.status(400).json({"message": "something went wrong"});
        }
    })

/**
 *  TOPICS PUT
 */

app.put("/topics/:id",
    function (req, res, next) {
        let id = req.params.id;
        try {
            console.log(id);
            topics.findOneAndUpdate({_id: mongo.ObjectId(id)}, {$set: req.body});
            res.status(200).json({"message": "updated"})
        } catch (e) {
            console.log(e)
            res.status(400).json({"message": "something went wrong"});
        }
    })


/**
 *  TOPICS DELETE
 */

app.delete("/topics/:id",
    function (req, res, next) {
        let id = req.params.id;
        try {
            topics.findOneAndDelete({_id: mongo.ObjectId(id)});
            res.status(200).json({"message": "deleted"})
        } catch (e) {
            console.log(e);
            res.status(400).json({"message": "something went wrong"});
        }
    }
)