const express = require("express");
const passport = require('passport');
const eventRoutes = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const nodemailer = require("nodemailer");

//adding a middleware to make protected route
eventRoutes.use((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect("/auth/login");
    }
  });

  //GET new event page
eventRoutes.get('/new-event',(req,res,next)=>{
    res.render('events/new-event');
});

eventRoutes.post('/new-event',(req,res,next)=>{
    const {name,location,description,date,time} = req.body; 
    console.log("req.body", req.body);
    console.log("name,location,description,date,time", name,location,description,date,time);
    

  const newEvent = new Event({
    name,
    location,
    description,
    date,
    _participants: [],
    comments: [],
    // time
  });
  newEvent.save()
    .then((event) => {
      res.redirect('/events')
    })
    .catch((error) => {
      console.log(error)
    })

})

eventRoutes.get("/", (req, res) => {
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
    .populate('_participants')
      .then(event => {
        const participants = event._participants;
        const comments = event.comments;
        res.render("events/details",{event, participants: participants, comments: comments})
      })
      .catch(error => {
        console.log(error)
      })
  });

eventRoutes.get('/:eventId/join',(req,res,next)=>{
  const joiningUserId = req.user._id;
  let eventId = req.params.eventId;
  Event.findById(eventId)
  .then( event => {
    event._participants.push( joiningUserId );
    event.save( (err, updatedEvent) => {
      if ( err ) {
        console.log( err )
      } else {
        res.redirect(`/events/${updatedEvent._id}`)
      }
    })
  } )
   //{ $push: {_participants: req.user._id} }

})

//adding comments on the event page

eventRoutes.post('/:eventId/comment', (req, res, next) => {
  let eventId = req.params.eventId;
  let text = req.body.text;

  Event.findById(eventId)
  .then(event =>{
    console.log("old   ",event);
    
    event.comments.unshift({
      text,
      _author: req.user._id,
      createdAt: new Date()

    });
    event.save()
    .then(updatedEvent=>{
      console.log("newwwww ",updatedEvent)
      res.redirect(`/events/${updatedEvent._id}`)
      // res.render('details', updatedEvent)
    })
    .catch(err=>{
      console.log(err)
    })
    
    })
  
  });


  //GET event-edit page
  // eventRoutes.get('/event-edit/:eventId', (req, res, next) => {
  //  let eventId = req.params.eventId;
  //  console.log('eventId',eventId)
  //   Event.findById(eventId)
  //     .then(event => {
  //       res.render('events/event-edit', {event});
  //     })
  //     .catch( err => { throw err } );
  // });

//edit event page
  eventRoutes.get('/:eventId/edit', (req, res, next) => {
    Event.findById( req.params.eventId )
      .then( event=> {
        console.log("hello")
        res.render( 'events/event-edit', event );
      })
      .catch( err => { throw err } );
  });


//update event page
eventRoutes.post('/:eventId/update', (req, res, next) => {
  console.log("req body :", req.body)
  let { 
    name, 
    location,
    description,
    date 
    } = req.body;

    let updatedChanges = {name, 
      location,
      description,
      date
    }
  Event.findByIdAndUpdate( req.params.eventId, updatedChanges)
    .then( event => {
      console.log("event  ", event)
      res.redirect( `/events`);
    })
    .catch( err => { throw err } );
});


//delete event
eventRoutes.get('/:eventId/delete', (req, res, next) => {
  Event.findByIdAndRemove( req.params.eventId )
    .then( () => {
      console.log("event deleted");
      res.redirect('/events');
    })
    .catch( err => { throw err } );
});

 module.exports = eventRoutes ;




       

    