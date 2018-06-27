const express = require("express");
const passport = require('passport');
const eventRoutes = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");
const router = express.Router();
// const ensureLogin = require("connect-ensure-login");
// const nodemailer = require("nodemailer");

eventRoutes.get('/new-event',(req,res,next)=>{
    res.render('events/new-event');
});

eventRoutes.post('/new-event',(req,res,next)=>{
    const {name,location,description,date,time} = req.body; 
    console.log("req.body", req.body);
    console.log("name,location,description,date,time", name,location,description,date,time);
    

    const newEvent = new Event ({
        name,
        location,
        description,
        date,
        // time
    });
    newEvent.save()
    .then((event)=>{
                res.redirect('/events/event')
            })
                .catch((error)=>{
                    console.log(error)
            })

})

eventRoutes.get("/event", (req, res) => {
    Event.find()
    .then((events)=>{
        console.log(events)
        res.render("events/event",{events})
    })
    .catch((error)=>{
        console.log(error)
    })
});

  eventRoutes.get('/:eventId', (req, res, next) => {
    let eventId = req.params.eventId;
    Event.findById(eventId)
      .then(event => {
        res.render("events/details",{event})
      })
      .catch(error => {
        console.log(error)
      })
  });

  module.exports = eventRoutes ;




       

    