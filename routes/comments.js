const express = require('express');
const router = express.Router({mergeParams : true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware')


//new comment	
router.get('/new', middleware.isLoggedIn, (req, res)=> {
	Campground.findById(req.params.id, (err, campground) => {
		if(err || !campground){
			req.flash("error", "Campground not found")
			res.redirect("back")
			
		} else {
			res.render("comments/new", {campground : campground})
		}
	})
	
})


//post comment
router.post('/', middleware.isLoggedIn, (req, res) => {

	Campground.findById(req.params.id, (err, campground) => {
		if(err){
			console.log(err)
			res.redirect('/campgrounds')
		} else{
			Comment.create(req.body.comment,(err, comment)=> {
				if(err){
					req.flash("error", "Something went wrong")
					console.log(err)
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment)
					campground.save()
					req.flash("success", "Successfully added comment")
					res.redirect('/campgrounds/'+campground._id)
				}
			} )
		}
	})
})

//COMMENTS EDIT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res)=> {

	Campground.findById(req.params.id, (err, foundCampground) => {
		if(err || !foundCampground){
			req.flash("error", "Cannot find that campground!")
			return res.redirect("back")
		}

		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if(err){
				res.redirect("back")
			} else {
				res.render('comments/edit', {campground_id : req.params.id, comment : foundComment})
			}
		})
	})
	
	
})

//COMMENTS UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res)=> {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if(err) {
			res.redirect("back")
		} else {
			res.redirect('/campgrounds/'+req.params.id)
		}
	})
})

//COMMENTS DELETE ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, (err, deletedComment)=>{
		if(err){
			res.redirect("back")
		} else{
			req.flash("success", "Comment deleted")
			res.redirect('/campgrounds/'+req.params.id)
		}
	})
})


//Middleware







module.exports = router