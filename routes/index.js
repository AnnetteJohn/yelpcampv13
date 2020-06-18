const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const passport = require('passport')
const User = require('../models/user')


//root route
router.get('/', function(req, res) {
	
	res.render("landing.ejs")
})




//register route
router.get('/register', (req, res) => {
	res.render('register')
})

//handle signup logic 
router.post('/register', (req, res) => {
	var newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password, (err, user) => {
		if(err){
			return res.render("register", {"error": err.message});
		}
		passport.authenticate("local")(req, res, ()=>{
			req.flash("success", "Welcome to Yelpcamp, "+user.username)
			res.redirect('/campgrounds')
		})
	})
})

//show login form 
router.get('/login', (req, res) => {
	res.render('login')
})

//handling login logic
router.post('/login', passport.authenticate("local", {
	successRedirect : '/campgrounds',

	failureRedirect : '/login'
}), (req, res) => {
})

//logout route
router.get('/logout', (req, res) => {
	req.logout()
	req.flash("success", "Logged you out!")
	res.redirect('/campgrounds')
})


//Middleware



module.exports = router