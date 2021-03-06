const express = require('express');
const app = express();
const mongo = require('mongodb')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const cors = require('cors')
const schedule = require('node-schedule')

const connectionString = "mongodb+srv://admin:admin@dezbatero.xrpsr.mongodb.net/test?authSource=admin&replicaSet=atlas-x3jw5l-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"

let db;
let topicsCollection;
let argumentsCollection;
let reportsCollection;

app.use(cors());

MongoClient.connect(connectionString, {useUnifiedTopology: true})
    .then(client => {
        console.log('Connected to Database')
        db = client.db('dezbate-ro')
        topicsCollection = db.collection('topics');
        argumentsCollection = db.collection('arguments');
        reportsCollection = db.collection('reports')
    }).then(
    function () {
        topicsCollection.find().toArray().then(topic => {
            topic.forEach(each => {
                let finalScore = 0;
                argumentsCollection.find({topic: mongo.ObjectId(each._id)}).toArray().then(result => {
                        result.forEach(each => {
                            if (each.type === 'pro')
                                finalScore += each.likes;
                            else
                                finalScore -= each.likes;
                        })
                        console.log(finalScore)
                        if (finalScore > 100 || finalScore < -100) {
                            topicsCollection.findOneAndUpdate({_id: each._id}, {$set: {"isClosed": true}});
                        }
                    }
                )
            })
        })
    }
)
    .catch(error => console.error(error))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(3001, function () {
    console.log('listening on 3001');
});

app.use((error, req, res, next) => {
    console.warn(error);
})

const checkClosingDebates = schedule.scheduleJob('0 0 0 * * * ', function () {
        topicsCollection.find().toArray().then(topic => {
            topic.forEach(each => {
                let finalScore = 0;
                argumentsCollection.find({topic: mongo.ObjectId(each._id)}).toArray().then(result => {
                        result.forEach(each => {
                            if (each.type === 'pro')
                                finalScore += each.likes;
                            else
                                finalScore -= each.likes;
                        })
                        console.log(finalScore)
                        if (finalScore > 100 || finalScore < -100) {
                            topicsCollection.findOneAndUpdate({_id: each._id}, {$set: {"isClosed": true}});
                        }
                    }
                )
            })
        })
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
            argumentsCollection.find({topic: mongo.ObjectId(id)}).toArray().then(result => {
                for (let i = 0; i < result.length; i++) {
                    console.log(result[i]._id);
                    argumentsCollection.deleteOne({_id: mongo.ObjectId(result[i]._id)})
                }
            })
            topicsCollection.findOneAndDelete({_id: mongo.ObjectId(id)}).then(result => {
                res.status(200).json({"message": "deleted"})
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({"message": "something went wrong"});
        }
    })

/**
 * TOPIC GET SCORE
 */

app.get("/topics/score/:id",
    function (req, res, next) {
        let id = req.params.id;
        let finalScore = 0;
        try {
            argumentsCollection.find({topic: mongo.ObjectId(id)}).toArray().then(result => {
                result.forEach(each => {
                    if (each.type === 'pro')
                        finalScore += each.likes;
                    else
                        finalScore -= each.likes;
                })
                res.status(200).json({"message": finalScore})
            })
        } catch (e) {
            res.status(404).json({"message": "something went wrong"});
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
            req.body.topic = mongo.ObjectId(req.body.topic);
            argumentsCollection.insertOne(req.body).then(result => {
                console.log(result.ops[0]._id);
                topicsCollection.findOneAndUpdate({_id: mongo.ObjectId(result.ops[0].topic)}, {$push: {children: mongo.ObjectId(result.ops[0]._id)}});
                res.status(201).json({message: "created"})
            })
        } catch (e) {
            res.status(400).json({"message": "something went wrong"});
        }
    })

/**
 *  ARGUMENT PUT
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


/**
 *  ARGUMENT DELETE
 */

app.delete("/arguments/:id",
    function (req, res, next) {
        let id = req.params.id;
        try {
            argumentsCollection.findOne({_id: mongo.ObjectId(id)}).then(result => {
                console.log(id)
                topicsCollection.findOneAndUpdate({_id: result.topic}, {$pull: {children: {$in: [mongo.ObjectId(id)]}}})
            })
            argumentsCollection.findOneAndDelete({_id: mongo.ObjectId(id)});
            res.status(200).json({"message": "deleted"})
        } catch (e) {
            console.log(e);
            res.status(400).json({"message": "something went wrong"});
        }
    })

/**
 *  ARGUMENTS GET FOR PARENT
 */


app.get("/arguments/parent/:id",
    function (req, res, next) {
        let id = req.params.id;
        console.log(mongo.ObjectId(id));
        let list = [];
        try {
            argumentsCollection.find({parent: id}).toArray().then(result => {
                    console.log(result)
                    // res.status(200).json({"message": result});
                    for (let i = 0; i < result.length; i++) {
                        list.push(result[i])
                    }
                    res.status(200).json({"message": list});
                }
            )
        } catch (e) {
            console.log(e);
            res.status(400).json({"message": "something went wrong"});
        }
    })

/**
 *  ARGUMENTS GET FOR TOPIC
 */

app.get("/arguments/topic/:id",
    function (req, res, next) {
        let id = req.params.id;
        let list = [];
        try {
            argumentsCollection.find({topic: mongo.ObjectId(id)}).toArray().then(result => {
                    // res.status(200).json({"message": result});
                    for (let i = 0; i < result.length; i++) {
                        list.push(result[i])
                    }
                    res.status(200).json({"message": list});
                }
            )
        } catch (e) {
            console.log(e);
            res.status(400).json({"message": "something went wrong"});
        }
    })

/**
 * REPORTS GET ALL
 */

app.get("/reports",
    function (req, res, next) {
        try {
            reportsCollection.find().toArray().then(result =>
                res.status(200).json({"message": result})
            );
        } catch (e) {
            res.status(404).json({"message": "something went wrong"});
        }
    })

/**
 * REPORT GETBYID
 */

app.get("/reports/:id",
    function (req, res, next) {
        let id = req.params.id;
        try {
            reportsCollection.findOne({_id: mongo.ObjectId(id)}).then(result =>
                res.status(200).json({message: result}));
        } catch (e) {
            res.status(404).json({"message": "something went wrong"});
        }
    })

/**
 * REPORT POST
 */

app.post("/reports",
    function (req, res, next) {
        try {
            reportsCollection.insertOne(req.body).then(result => {
                res.status(201).json({message: "created"})
            })
        } catch (e) {
            res.status(400).json({"message": "something went wrong"});
        }
    })

/**
 *  REPORT PUT
 */

app.put("/reports/:id",
    function (req, res, next) {
        let id = req.params.id;
        try {
            reportsCollection.findOneAndUpdate({_id: mongo.ObjectId(id)}, {$set: req.body});
            res.status(200).json({"message": "updated"})
        } catch (e) {
            console.log(e)
            res.status(400).json({"message": "something went wrong"});
        }
    })
