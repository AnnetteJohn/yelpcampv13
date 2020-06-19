var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    flash       = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    methodOverride = require('method-override'),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");


var commentRoutes 		= require('./routes/comments'),
	campgroundRoutes 	= require('./routes/campgrounds'),
	indexRoutes 			= require('./routes/index');

   // mongodb://localhost:27017/yelp_campv13
  // mongodb+srv://annettejohn:Annette317@cluster0-brz9v.mongodb.net/<dbname>?retryWrites=true&w=majority
//seedDB() //seed the database

var dburl = process.env.DATBASEURL || "mongodb://localhost:27017/yelp_campv13";
mongoose.set('useUnifiedTopology', true);
mongoose.connect(dburl , { 
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('Connected to DB');
}).catch(err => {
    console.log('ERROR:', err.message);
})


//Middlewares
app.use(methodOverride("_method"))
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine" , "ejs")
app.use(express.static(__dirname+"/public"))
app.use(flash())


//PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret :" cats are the best",
	resave : false,
	saveUninitialized : false 
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
	next()
})


 
 

app.use('/', indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});