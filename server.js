//server.js
'use strict'

//first we import our dependencies...
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./model/users');

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set it up, or 3001
var port = process.env.API_PORT || 4000;

//db config -- REPLACE USERNAME/PASSWORD/DATABASE WITH YOUR OWN FROM MLAB!
var mongoDB = 'mongodb://thinklabs:thinklabs@ds023478.mlab.com:23478/react_learing';

mongoose.connect(mongoDB, { useMongoClient: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//now we should configure the APi to use bodyParser and look for JSON data in the body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

    //and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//now  we can set the route path & initialize the API
router.get('/', function(req, res) {
    res.json({ message: 'API Initialized!'});
});

//adding the /comments route to our /api router
router.route('/users')
    .get(function(req, res) {
        //get all Users database
        User.find(function(err, users) {
            if (err)
                res.send(err);
            //responds with a json object of our database comments.
            res.json(users)
        });
    })

router.route('/register')
    //post new comment to the database
    .post(function(req, res) {
        var user = new User();
        (req.body.first_name) ? user.first_name = req.body.first_name : null;
        (req.body.last_name) ? user.last_name = req.body.last_name : null;
        (req.body.userid) ? user.userid = req.body.userid : null;
        (req.body.password) ? user.password = req.body.password : null;
        (req.body.role) ? user.role = req.body.role : null;

        user.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Register successfully added!' });
        });
    });

router.route('/login')
    //post new comment to the database
    .post(function(req, res) {
        User.findOne({userid: req.body.userid, password: req.body.password, role: req.body.role}, function (err, user) {
            if (err) {
                response.success = false;
                response.data = err;
                res.json(response);
            }
            if (!user) {
                response.success = false;
                response.data = 'Invalid username or password';
                res.json(response);
            } else {
                console.log(user);
                res.json(user);
            }
        });
    });

//Adding a route to a specific comment based on the database ID
router.route('/users/:user_id')
//The put method gives us the chance to update our comment based on the ID passed to the route
    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            //setting the new author and text to whatever was changed. If nothing was changed
            // we will not alter the field.
            (req.body.first_name) ? user.first_name = req.body.first_name : null;
            (req.body.last_name) ? user.last_name = req.body.last_name : null;
            (req.body.userid) ? user.userid = req.body.userid : null;
            (req.body.password) ? user.password = req.body.password : null;

            //save comment
            user.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Comment has been updated' });
            });
        });
    })
    //delete method for removing a comment from our database
    .delete(function(req, res) {
        //selects the comment by its ID, then removes it.
        User.remove({ _id: req.params.user_id }, function(err, user) {
            if (err)
                res.send(err);
            res.json({ message: 'User has been deleted' })
        })
    });

//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function() {
    console.log('api running on port ${port}');
});
