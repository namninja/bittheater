const Feature = require('./models/feature');
const Genre = require('./models/genre');
const Badge = require('./models/badges');
const Review = require('./models/review');
const Show = require('./models/show');
const User = require('./models/user');
const Showlist = require('./models/showlist');
const moment = require('moment');

module.exports = function(app, passport){

	app.get('/showlists', function(req, res) {
        var showsObj = {};
    Showlist.find({'public' : 'true'}, function(err, showlists) {
        if(err) {
            res.status(500).send(err);
        } else { 
            Show.find({},function(showE,shows){
            if(err) {
            res.status(500).send(err);
            } else {          
                for (var i = 0; i < shows.length; i++) {
                    showsObj[shows[i]._id] = shows[i].showTitle;
            } res.render('showlists.ejs', {user: req.user, mainShows: showsObj, showlists: showlists});
            // res.send(showlists);
           }
        });
        };
    });
    });

        app.post('/showlist', function(req, res) {
        
        var body = req.body;
        body.shows = [];
        var count = 0;
        var shows = true;
        while(shows){
            if(req.body.hasOwnProperty('showID_'+count)){
                body.shows.push({
                    showId: req.body['showID_'+count],
                    showDate: req.body['showDate_'+count],
                    showNotes: req.body['showNotes_'+count]
                });
                count++;
            } else {
                shows = false;
            }
        }
        var showlist = new Showlist({
            id: req.params.id,
            userId: body.userId,
            showListTitle: body.showListTitle,
            showListDescription: body.showListDescription,
            showListType: body.showListType,
            public: body.public,
            shows: body.shows
        });
        showlist.save(function (err, newShowlist) {
            User.findOne({_id: req.user._id}, function(err, user) {
                if(err) {
                    res.status(500).send(err);
                } else {
                    Showlist.find({userId:req.user._id},function(se,showlists){
                        if(!se){
                            var userShowlists = showlists.length;
                            Badge.find({_id: {$nin: user.badges},type:'List'},function(berror,badges){
                                if(!berror){
                                    for (var i = 0; i < badges.length; i++) {
                                        if(userShowlists >= badges[i].number){
                                            user.badges.push(badges[i]._id);
                                        }
                                    }
                                    user.save(function(saveErr,finalUser){
                                        res.redirect('/dashboard');
                                    });
                                } else {
                                    res.send(e2);
                                }
                            });
                        } else {
                            res.send(re);
                        }
                    }); 
                }
            });
        });
    }); 


    app.get('/showlist', function(req, res) {
    var showsObj = {};
    Showlist.find({}, function(err, showlists) {
        if(err) {
            res.status(500).send(err);
        } else { 
            Show.find({},function(showE,shows){
            if(err) {
            res.status(500).send(err);
            } else {          
                for (var i = 0; i < shows.length; i++) {
                    showsObj[shows[i]._id] = shows[i].showTitle;
            } res.render('showlist.ejs', {user: req.user, mainShows: showsObj, showlists: showlists});
            // res.send(showlists);
           }
        });
        };
    });
    });

    app.get('/showlist/:id', function(req, res) {
    var showsObj = {};
    Showlist.findById({_id: req.params.id}, function(err, showlists) {
        if(err) {
            res.status(500).send(err);
        } else { 
            Show.find({},function(showE,shows){
            if(err) {
            res.status(500).send(err);
            } else {          
                for (var i = 0; i < shows.length; i++) {
                    showsObj[shows[i]._id] = shows[i].showTitle;
            } res.render('showlist.ejs', {user: req.user, mainShows: showsObj, showlists: showlists, moment: moment});
           }
        });
        };
    });
    });

    app.get('/create-showlist', isLoggedIn, function(req, res) {
    Show.find({},null,{sort: {showTitle:1}}, function(err, shows) {
        if(err) {
            res.status(500).send(err);
        } else {
            res.render('create-showlist.ejs', {shows: shows, user: req.user});
        }
        });
    }); 

    app.put('/showlist/:id', function(req, res) {
    Showlist.findById({_id: req.params.id}, function (err, showlist) {  
        if (err) {
            res.status(500).send(err);
        } else {
            showlist.showListTitle = req.body.showListTitle;
            showlist.showListDescription = req.body.showListDescription;
            showlist.showListType = req.body.showListType; 
            showlist.public = req.body.public;
            showlist.save(function (err, showlist) {
                if (err) {
                    res.status(500).send(err)
                }
                res.send(showlist);
            });
        }
    });
    }); 

}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}