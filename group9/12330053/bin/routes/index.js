var express = require('express');
var router = express.Router();
var Course = require('../models/course');
var User = require('../models/user');
var Upload = require('../models/upload');
var courseHandle = require('../course/handler');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* GET add homework page. */
	router.get('/addHw', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('add', { message: req.flash('add') });
	});

	router.post('/score', function(req, res) {
    	// Display the Login page with any flash message, if any
    	var curId = req.query.uploadId;
    	var score = req.body.score;
		Upload.update({_id:curId},{score:score},function(err){
            if (err){
                console.log('Error in Saving user: '+err);
                throw err;
            }
            console.log('User Registration succesful');
		});
		res.redirect('/home');
	});


	router.get('/upload', function(req, res) {
    	// Display the Login page with any flash message, if any
    	console.log(req.query.id);
		User.findOne({"_id":req.query.id}).exec(function(err,doc){
	    	Course.find().exec(function(err,docs){
				console.log(doc);
				res.render('upload', {
					courses:docs,
	    			schoolId:doc.schoolId,
	    			student:doc.username
	    		});
	    	});
    	});
	});
	router.get('/modify', function(req, res) {
    	// Display the Login page with any flash message, if any
    	var curId = req.query.id;
	    	Course.findOne({"_id":curId}).exec(function(err,doc){
	    		res.render('modify', {
	    			message: req.flash('modify'),
	    			course:doc,
	    		});
	    });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true
	}));

	router.post('/registerCourse',function(req,res){
		//res.redirect('/home',{user: req.user});
		var CourseName = req.body.CourseName;
		var describe = req.body.describe;
		var deadline = req.body.deadline;
		var newCourse = new Course();
		newCourse.CourseName = CourseName;
		newCourse.deadline = deadline;
		newCourse.describe = describe;
        newCourse.save(function(err) {
            if (err){
                console.log('Error in Saving user: '+err);
                throw err;
            }
            console.log('User Registration succesful');
        });
		res.redirect('/home');
	});

	router.post('/modifyCourse',function(req,res){
		//res.redirect('/home',{user: req.user});
		var CourseName = req.body.CourseName;
		var describe = req.body.describe;
		var deadline = req.body.deadline;
		var curId = req.query.id;
		Course.update({_id:curId},{CourseName:CourseName,describe:describe,deadline:deadline},function(err){
            if (err){
                console.log('Error in Saving user: '+err);
                throw err;
            }
            console.log('User Registration succesful');
		});
		res.redirect('/home');
	});

	router.post('/uploadHw',function(req,res){
		var curDate = new Date();
		var newUpload = new Upload();
		Course.findOne({CourseName:req.body.course}).exec(function(err,doc){
			newUpload.deadline = doc.deadline;
			newUpload.uploadDate = curDate;
			newUpload.schoolId = req.body.schoolId;
			newUpload.student = req.body.student;
			newUpload.course = req.body.course;
			newUpload.homework = req.body.homework;
			newUpload.save();
			res.redirect('/home');
		});

	});

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		var curDate = Date.now();
		var cDate = new Date();

		Course.find().exec(function(err,docs){
			Upload.find().exec(function(err,docs2){
				//对每个docs进行检查是否已经过deadline，如果是，则timeout = true
				for (var k in docs2){
					//console.log(Date.parse(docs2[k].deadline));
					var sub = curDate-Date.parse(docs2[k].deadline);
					//console.log(sub);
					if (sub){//true则证明deadline没到
						docs2[k].timeout = false;
					}else{
						docs2[k].timeout = true;
					}
					//console.log(docs2[k].timeout);
				}
				res.render('home', {
					user: req.user,
					courses:docs,
					uploads:docs2,
					date:cDate
				});
			});
		});
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}





