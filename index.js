const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const AllData = require("./AllData")
const MentorDetails = require("./MentorDetails");
const e = require("express");

app.set('view engine', 'ejs');
app
.use(express.static(__dirname + '/public'))
.use(bodyParser.urlencoded({extended: true}))
.get("/", (req, res)=>{                     
    res.sendFile(__dirname +"/index.html")
})
.get("/check", (req, res)=>{                      //Fetches all the Data
    res.status(200).json({
        data:AllData
    })
})
.get("/data", (req, res)=>{    
    res.render("trail", {data: AllData} ) 
})
.post("/SpecificMentor",(req,res)=>{                      //Fetches all the Available Hall to book
    let mentor = req.body.MentorName;
    let Filtered = AllData.filter((data)=> data.MentorName === mentor)
    if(Filtered.length>0){
        res.render("specific", {data: Filtered} ) 
    }else{
       res.sendFile(__dirname + "/public/failure.html")  
    }
    
})
.get("/mentors", (req, res)=>{                      //Fetches all the Data
    res.render("mentors", {data: MentorDetails} ) 
})
.post("/assignMentor", (req,res) => {
    let mentor =  req.body.MentorName
    MentorDetails.forEach((allMentors)=>{
        if(allMentors.MentorName === mentor){
            AllData.filter((student)=>{
            if(student.MentorName === "NA"){
                student.MentorName = mentor
                res.sendFile(__dirname + "/public/success.html") 
            }
        })
        }
    })
    res.sendFile(__dirname + "/public/failure.html") 
})
.post("/createStudent", (req, res)=>{  
let Input = AllData.filter((data)=> data.Name === req.body.Name)
    if(Input.length===0){
        req.body.MentorName = "NA"
        AllData.push(req.body)
        res.sendFile(__dirname + "/public/success.html") 
    }
    if(Input.length>0){
        res.sendFile(__dirname + "/public/failure.html")   
    }

})
.post("/createMentor", (req, res)=>{
let Input = MentorDetails.filter((data)=> data.MentorName === req.body.MentorName)
    if(Input.length===0){
        MentorDetails.push(req.body)
        res.sendFile(__dirname + "/public/success.html")  
    }
    if(Input.length>0){
        res.sendFile(__dirname + "/public/failure.html")   
    }
})
.post("/assignSingleMentor", (req, res)=>{
    let student = req.body.StudentName;
    let mentor = req.body.MentorName;
    MentorDetails.forEach((data)=>{
        if(data.MentorName === mentor){
                AllData.forEach((data) => {
                if(data.Name === student){
                    data.MentorName = mentor;
                }
            })
        res.sendFile(__dirname + "/public/success.html")  
        }
    })
    res.sendFile(__dirname + "/public/failure.html")
})

.listen(process.env.PORT)




