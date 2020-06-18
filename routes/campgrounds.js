const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware')


//INDEX route
router.get('/', function(req, res){
	
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err)
		}
		else{
			res.render("campgrounds/index", {campgrounds : campgrounds})
		}
	})
	
})

//NEW 
router.get('/new', middleware.isLoggedIn, function(req, res){
	
	
	 res.render('campgrounds/new')
	
	
})


//CREATE
router.post('/', middleware.isLoggedIn, function(req, res){
	
	const name = req.body.name;
	const price = req.body.price;
	const image = req.body.image;
	const desc = req.body.description;
	const author = {
		username : req.user.username,
		id : req.user._id 
	}
	const newCampGround = { name:name, price:price, image:image, description:desc, author : author};
	
	Campground.create(newCampGround, function(err, newlyCreated){
		if(err){
			console.log(err)
		}
		else{
			
			res.redirect('/campgrounds')
		}
	})
	
	//campgrounds.push(newCampGround);
	
	
})

//SHOW 
router.get('/:id', function(req, res){
	
	Campground.findById(req.params.id).populate("comments").exec(
	function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found")
			res.redirect("back")
		}
		else{
			res.render("campgrounds/show" , {campground : foundCampground})
		}
	})
	
})
	
//EDIT 
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {

	
		Campground.findById(req.params.id, (err, foundCampground) => {
		
		res.render('campgrounds/edit', {campground : foundCampground});	
	
});
});

//UPDATE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {

	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if(err){
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/' + req.params.id)
		}
		
	})
})

//DESTROY
// router.delete('/:id', (req, res) => {
// 	Campground.findByIdAndRemove(req.params.id, (err) => {
// 		if(err){
// 			res.redirect('/campgrounds')
// 		} else {
// 			res.redirect('/campgrounds')
// 		}
// 	})
// })

//NEW DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, async(req, res) => {
	try {
	  let foundCampground = await Campground.findById(req.params.id);
	  await foundCampground.remove();
	  res.redirect("/campgrounds");
	} catch (error) {
	  console.log(error.message);
	  res.redirect("/campgrounds");
	}
  });

//Middlewares






module.exports = router 