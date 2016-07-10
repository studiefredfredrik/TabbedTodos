var Todo = require('./models/todo');
var List = require('./models/list');

module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/WWW', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
	
	// current user request ==============================
    app.get('/currentUser', function(req, res) {
		res.json({user: req.user});
    });
	


// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/WWW', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/WWW', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/WWW',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/WWW',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/WWW',
                failureRedirect : '/'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/WWW', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/WWW',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/WWW',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/WWW',
                failureRedirect : '/'
            }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/WWW');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/WWW');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/WWW');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/WWW');
        });
    });
	
	
// =============================================================================
// TODO API ====================================================================
// =============================================================================
	// get all todos
	app.get('/api/todos', function(req, res) {
		console.log('req.user._id: ');
		console.log(req.user._id);
		
		// Get all list for the user. Then get all todos in that list
		Todo.find({user:req.user._id},function(err, todos) {
			console.log(todos);
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)
			res.json(todos); // return all todos in JSON format
		});
	});

	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {
		// create a todo, information comes from AJAX request from Angular
		Todo.create({
			user: req.user._id,
			text : req.body.text,
			done : false,
			list : req.body.list
		}, function(err, todo) {
			if (err)
				res.send(err);
						// Get all list for the user. Then get all todos in that list
			Todo.find({user:req.user._id},function(err, todos) {
				console.log(todos);
				// if there is an error retrieving, send the error. nothing after res.send(err) will execute
				if (err)
					res.send(err)
				res.json(todos); // return all todos in JSON format
			});
				
		});
	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {
		Todo.remove({
			_id : req.params.todo_id, user: req.user._id
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Todo.find({user:req.user._id},function(err, todos) {
				if (err)
					res.send(err)
				res.json(todos);
			});
		});
	});
	
	// update a todo
	app.put('/api/todos/:todo_id', function(req, res) {
	console.log('req: --');
	console.log(req.body);
		Todo.update(
		{
			_id : req.params.todo_id
		},
		{
			user: req.user._id,
			list: req.body.list,
			text : req.body.text,
			done : req.body.done
		},
			function(err, todo) {
				if (err)
					res.send(err);

				// get and return all the todos after you create another
				Todo.find({user:req.user._id},function(err, todos) {
					if (err)
						res.send(err)
					console.log(todos);
					res.json(todos);
			});
		});
	});
	
	
// =============================================================================
// LIST API ====================================================================
// =============================================================================
	// get all lists for a user
	app.get('/api/lists', function(req, res) {
		console.log('req.user._id: ');
		console.log(req.user._id);
		List.find({user:req.user._id},function(err, lists) {
			console.log(lists);
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)
			res.json(lists); // return all lists in JSON format
		});
	});

	// create list and send back all lists after creation
	app.post('/api/lists', function(req, res) {
		// create a list, information comes from AJAX request from Angular
		List.create({
			user: req.user._id,
			name : req.body.name,
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the lists after you create another
			List.find({user:req.user._id},function(err, lists) {
				if (err)
					res.send(err)
				res.json(lists);
			});
		});

	});

	// delete a list
	app.delete('/api/lists/:list_id', function(req, res) {
		List.remove({
			_id : req.params.list_id, user: req.user._id
		}, function(err, list) {
			if (err)
				res.send(err);

			// get and return all the lists after you delete one
			List.find({user:req.user._id},function(err, lists) {
				if (err)
					res.send(err)
				res.json(lists);
			});
		});
	});
	
	// update a list
	app.put('/api/list/:list_id', function(req, res) {
	console.log('req: --');
	console.log(req.body);
		List.update(
		{
			_id : req.params.todo_id, user: req.user._id
		},
		{			
			user: req.user._id,
			name : req.body.name,
		},
			function(err, list) {
				if (err)
					res.send(err);

			// get and return all the lists after you u one
			List.find({user:req.user._id},function(err, lists) {
				if (err)
					res.send(err)
				res.json(lists);
			});
		});
	});
	
	


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}






