const express = require('express');
const app = express();
const mongo = require('mongodb')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')

const connectionString = "mongodb+srv://admin:admin@dezbatero.xrpsr.mongodb.net/test?authSource=admin&replicaSet=atlas-x3jw5l-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"

let db;
let topicsCollection;
let argumentsCollection;

MongoClient.connect(connectionString, {useUnifiedTopology: true})
    .then(client => {
        console.log('Connected to Database')
        db = client.db('dezbate-ro')
        topicsCollection = db.collection('topics');
        argumentsCollection = db.collection('arguments');
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
            topicsCollection.find().toArray().then(result =>
                res.status(200).json({"message": result})
            );
        } catch (e) {
            res.status(404).json({"message": "something went wrong"});
        }
    })

/**
 * TOPIC GETBYID
 */

app.get("/topics/:id",
    function (req, res, next) {
        let id = req.params.id;
        try {
            topicsCollection.findOne({_id: mongo.ObjectId(id)}).then(result =>
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
            topicsCollection.insertOne(req.body).then(result => {
                res.status(201).json({message: "created"})
            })
        } catch (e) {
            res.status(400).json({"message": "something went wrong"});
        }
    })

/**
 * TOPIC ADD A VIEW
 */

app.put("/topics/addview/:id",
    function (req, res, next) {
        let id = req.params.id;
        try {
            console.log(id);
            topicsCollection.findOneAndUpdate({_id: mongo.ObjectId(id)}, {$inc: {"views": 1}});
            res.status(200).json({"message": "updated"})
        } catch (e) {
            console.log(e)
            res.status(400).json({"message": "something went wrong"});
        }
    })

/**
 *  TOPIC PUT
 */

app.put("/topics/:id",
    function (req, res, next) {
        let id = req.params.id;
        try {
            console.log(id);
            topicsCollection.findOneAndUpdate({_id: mongo.ObjectId(id)}, {$set: req.body});
            res.status(200).json({"message": "updated"})
        } catch (e) {
            console.log(e)
            res.status(400).json({"message": "something went wrong"});
        }
    })


/**
 *  TOPIC DELETE
 */

app.delete("/topics/:id",
    function (req, res, next) {
        let id = req.params.id;
        try {
            topicsCollection.findOneAndDelete({_id: mongo.ObjectId(id)});
            res.status(200).json({"message": "deleted"})
        } catch (e) {
            console.log(e);
            res.status(400).json({"message": "something went wrong"});
        }
    })

/**
 * ARGUMENTS GET ALL
 */
app.get("/arguments",
    function (req, res, next) {
        try {
            argumentsCollection.find().toArray().then(result =>
                res.status(200).json({"message": result})
            );
        } catch (e) {
            res.status(404).json({"message": "something went wrong"});
        }
    })

/**
 * ARGUMENT GETBYID
 */

app.get("/arguments/:id",
    function (req, res, next) {
        let id = req.params.id;
        try {
            argumentsCollection.findOne({_id: mongo.ObjectId(id)}).then(result =>
                res.status(200).json({message: result}));
        } catch (e) {
            res.status(404).json({"message": "something went wrong"});
        }
    })

/**
 * ARGUMENT POST
 */

app.post("/arguments",
    function (req, res, next) {
        try {
            argumentsCollection.insertOne(req.body).then(result => {
                res.status(201).json({message: "created"})
            })
        } catch (e) {
            res.status(400).json({"message": "something went wrong"});
        }
    })

/**
 *  TOPIC PUT
 */

app.put("/arguments/:id",
    function (req, res, next) {
        let id = req.params.id;
        try {
            console.log(id);
            argumentsCollection.findOneAndUpdate({_id: mongo.ObjectId(id)}, {$set: req.body});
            res.status(200).json({"message": "updated"})
        } catch (e) {
            console.log(e)
            res.status(400).json({"message": "something went wrong"});
        }
    })
