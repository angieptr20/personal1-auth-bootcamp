module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      db.collection('scores').find({ username: req.user.local.email }).toArray((err, scoreResult) => {
          if (err) return console.log(err);
  
          db.collection('capitals').find({ username: req.user.local.email }).toArray((err, capitalResult) => {
              if (err) return console.log(err);
  
              res.render('profile.ejs', {
                  user: req.user,
                  scores: scoreResult, // Scores remain untouched
                  capitals: capitalResult // Capital guesses appear dynamically
              });
          });
      });
  });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// message board routes ===============================================================


    // API Route to Update Score
      app.put('/update-score', (req, res) => {
        console.log(req.body)
        db.collection('scores')
        .findOneAndUpdate({username: req.body.username}, {
          $set: {
            score: Number(req.body.score) + 1
          }
        }, {
          sort: {_id: -1},
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
        })
      }) 
 

    //   app.put('/update-score', (req, res) => {
    //     if (!req.body.isCorrect) return res.send("Incorrect answer, no score update.");
    //     db.collection('scores')
    //       .findOneAndUpdate(
    //         { username: req.body.username },
    //         { $inc: { score: 1} }, // Increment inside MongoDB
    //         { upsert: true, returnDocument: 'after' },
    //         (err, result) => {
    //           if (err) return res.send(err);
    //           res.send(result);
    //         }
    //       );
    // });      

    app.post('/submit-capital', (req, res) => {
      db.collection('capitals').insertOne({
          username: req.body.username,
          capital: req.body.capital
      }, (err, result) => {
          if (err) return res.send(err);
          console.log("Capital saved!");
          res.redirect('/profile');
      });
  });

  app.delete('/delete-capital', (req, res) => {
    db.collection('capitals').findOneAndDelete(
        { username: req.body.username, capital: req.body.capital },
        (err, result) => {
            if (err) return res.send(500, err);
            res.send("Capital deleted!");
        }
    );
});


// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form3
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
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
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
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
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
