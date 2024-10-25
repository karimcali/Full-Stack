const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const Booking = require('./models/booking');


const app = express();

const mongooseConnect = 'mongodb://localhost:27017/Bookings'
mongoose.connect(mongooseConnect, { useNewUrlParser: true, useUnifiedTopology: true })
 .then((result) => console.log('MongoDB is connected'))
 .catch((err) => console.log(err))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));



// Set the views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




// Define a route for creating new bookings (POST request)
app.post('/view_booking', (req, res) => {
    const { workshopOption, firstName, lastName, email, phoneNumber, bookingDate, bookingTime } = req.body;


    const newBooking = new Booking({
        workshopOption,
        firstName,
        lastName,
        email,
        phoneNumber,
        bookingDate,
        bookingTime,
    });

    // Save the booking to the database
    newBooking.save()
        .then(result => {
            
            console.log('Booking saved:', result);
            res.redirect('/view_booking'); 
        })
        .catch(err => {
            
            console.error('Error saving booking:', err);
            res.status(500).send('Error processing booking');
        });
});



app.get('/view_booking', function(req, res) {
    // Fetch bookings data specific to workshops from the database
    Booking.findOne().sort({ createdAt: -1 })
    .then((latestBooking) => {
        const bookings = [latestBooking]; 
        res.render('view_booking', { bookings });
      })
      .catch((err) => {
        console.error('Error fetching bookings:', err);
        res.status(500).send('Error fetching bookings');
      });
});

  app.get('/process_booking', (req, res) => {
   
    Booking.find()
      .then((bookings) => {
        
        res.render('process_booking', { bookings });
      })
      .catch((err) => {
        console.error('Error fetching bookings:', err);
        res.status(500).send('Error fetching bookings');
      });
  });

// Modify routes
app.get('/modify_booking', (req, res) => {
    Booking.find()
        .then((bookings) => {
            res.render('modify_booking', { bookings, booking: null }); 
        })
        .catch((err) => {
            console.error('Error fetching bookings:', err);
            res.status(500).send('Error fetching bookings');
        });
});

app.get('/modify_booking/:id', (req, res) => {
    const bookingId = req.params.id;

    Booking.findById(bookingId)
        .then((booking) => {
            Booking.find()
                .then((bookings) => {
                    res.render('modify_booking', { bookings, booking }); 
                })
                .catch((err) => {
                    console.error('Error fetching bookings:', err);
                    res.status(500).send('Error fetching bookings');
                });
        })
        .catch((err) => {
            console.error('Error fetching booking for modification:', err);
            res.status(500).send('Error fetching booking for modification');
        });
});

app.post('/modify_booking', (req, res) => {
    const { bookingId, workshopOption, firstName, lastName, email, phoneNumber, bookingDate, bookingTime } = req.body;
  
    Booking.findByIdAndUpdate(bookingId, {
        workshopOption,
        firstName,
        lastName,
        email,
        phoneNumber,
        bookingDate,
        bookingTime,
    })
      .then(() => {
        res.redirect('/modify_booking'); 
      })
      .catch((err) => {
        console.error('Error updating booking:', err);
        res.status(500).send('Error updating booking');
      });
  });

// Delete route
app.get('/delete_booking', function(req, res) {
 
  Booking.find()
        .then((bookings) => {
            res.render('delete_booking', { bookings, booking: null }); 
        })
        .catch((err) => {
            console.error('Error fetching bookings:', err);
            res.status(500).send('Error fetching bookings');
        });
        
       
});
app.post('/delete_booking/:id', (req, res) => {
  const bookingId = req.params.id;

  // Using findByIdAndDelete to delete the booking by ID
  Booking.findByIdAndDelete(bookingId)
    .then(() => {
      console.log('Deleting booking with ID:', bookingId);
      res.redirect('/delete_booking'); 
    })
    .catch((err) => {
      console.error('Error deleting booking:', err);
      res.status(500).send('Error deleting booking');
    });
});


// Report route
app.get('/report_booking', (req, res) => {
  Booking.find()
      .then((bookings) => {
          res.render('report_booking', { bookings });
      })
      .catch((err) => {
          console.error('Error fetching bookings:', err);
          res.status(500).send('Error fetching bookings');
      });
});
  


app.get('/', function(req, res) {
    res.render('home'); 
});


app.get('/home', function(req, res) {
    res.render('home'); 
});


app.get('/report_booking', function(req, res) {
    res.render('report_booking'); 
});


app.get('/report_workshops', function(req, res) {
    res.render('report_workshops'); 
});


app.get('/delete_booking', function(req, res) {
    res.render('delete_booking'); 
});


app.get('/modify_booking', function(req, res) {
    res.render('modify_booking'); 
});

app.get('/create_booking', function(req, res) {
    res.render('create_booking'); 
});

app.get('/create_booking/workshop1', function(req, res){
    res.render('workshop1');
});

app.get('/create_booking/workshop2', function(req, res){
    res.render('workshop2');
});

app.get('/create_booking/workshop3', function(req, res){
    res.render('workshop3');
});

app.get('/about', function(req, res){
    res.render('about');
});

app.get('/help', function(req, res){
    res.render('help');
});


// Start the server
const port = 3000;
app.listen(port, function() {
  console.log('Server is running in port', port)
});

