const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require('mongodb').MongoClient;
require("dotenv").config();

const url = process.env.MONGO_URL;

app.set('view engine', 'ejs');
app
.use(express.static(__dirname + '/public'))
.use(bodyParser.urlencoded({extended: true}))

.get("/", (req, res)=>{                                                     //Home Page
    res.sendFile(__dirname +"/index.html")
})
.get("/data", (req, res)=>{                                                 //Fetches all the Students data
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("new");
    dbo.collection("students").find().toArray(function(err, result) {
        if (err) throw err;
        if(result.length>0){ res.render("students", {data: result} )  }
        if(result.length===0){res.sendFile(__dirname + "/public/failure.html")}
        db.close();
    });
    });                                
    
})
.get("/mentors", (req, res)=>{                                              //Fetches all the Mentors
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("new");
    dbo.collection("mentors").find().toArray(function(err, result) {
        if (err) throw err;
        if(result.length>0){res.render("mentors", {data: result} ) }
        if(result.length===0){res.sendFile(__dirname + "/public/failure.html")}
        db.close();
    });
    });                              
})
.post("/SpecificMentor",(req,res)=>{                                       //Fetches Students under one Mentor
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("new");
    var query = { MentorName: req.body.MentorName };
    dbo.collection("students").find(query).toArray(function(err, result) {
        if (err) throw err;
        if(result.length>0){res.render("specific", {data: result} ) }
        if(result.length===0){res.sendFile(__dirname + "/public/failure.html")}
        db.close();
    });
    });    
})
.post("/assignMentor", (req,res) => {                                   //Assign mentor to all unassigned students
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("new");
    var query = { MentorName: "NA" };
    var query1 = { MentorName: req.body.MentorName };
    var newvalues = {$set: {MentorName: req.body.MentorName} };
    dbo.collection("mentors").find(query1).toArray(function(err, result) {
        if (err) throw err;
        if(result.length>0){ 
            dbo.collection("students").updateMany(query, newvalues, function(err, res){
            if (err) throw err;
            db.close();
            });
            res.sendFile(__dirname + "/public/success.html") 
        }else{
           res.sendFile(__dirname + "/public/failure.html") 
        }
    });
})
})
.post("/assignSingleMentor", (req, res)=>{                              // Update/Assign Mentor to Students 
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("new");
    var query = { Name: req.body.StudentName };
    var newvalues = {$set: {MentorName: req.body.MentorName} };
    dbo.collection("students").find(query).toArray(function(err, result) {
        if (err) throw err;
        if(result.length>0){
            dbo.collection("students").updateOne(query, newvalues, function(err, res){
            if (err) throw err;
            db.close();
            });
            res.sendFile(__dirname + "/public/success.html") 
        }else{
           res.sendFile(__dirname + "/public/failure.html") 
        }
    });
})
})
.post("/createStudent", (req, res)=>{                                   //Create a new Student 
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("new");
        var query = { Name: req.body.Name };
        dbo.collection("students").find(query).toArray(function(err, result) {
        if (err) throw err;
        if(result.length === 0){
            req.body["MentorName"] = "NA" 
            dbo.collection("students").insertOne(req.body, function(err, res) {
            if (err) throw err;
            db.close();
            });
            res.sendFile(__dirname + "/public/success.html") 
        }else{
            res.sendFile(__dirname + "/public/failure.html")
        }
        
    });                                                                              
    });

})
.post("/createMentor", (req, res)=>{                                    //Create a new Mentor
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("new");
        var query = { MentorName: req.body.MentorName };
        dbo.collection("mentors").find(query).toArray(function(err, result) {
        if (err) throw err;
        if(result.length === 0){ 
            dbo.collection("mentors").insertOne(req.body, function(err, res) {
            if (err) throw err;
            db.close();
            });
            res.sendFile(__dirname + "/public/success.html") 
        }else{
            res.sendFile(__dirname + "/public/failure.html")
        }
        
    });                                                                              
    });
})
.get("*", (req, res)=>{                                             // Default route                    
    res.sendFile(__dirname+"/public/notFound.html")
})
.listen(process.env.PORT)




