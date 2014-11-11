module.exports = function(app, passport) {

    // var stuff = require('./index');

    // console.log(app);

    /*===================================
    =            View routes            =
    ===================================*/

    app.get('/login', function(req, res) {
        res.render('login', { user: req.user });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/admin',
        failureRedirect: '/admin'
        // failureFlash: true
    }));

    // app.get('/admin', ensureAuthenticated, function(req, res){
    //     res.render('admin', { user: req.user });
    // });

    app.get('/partials/:name', ensureAuthenticated, function (req, res) {
        var name = req.params.name;
        console.log('name: ', name);
        console.log('user: ', req.user);
        res.render('partials/' + name, { user: req.user, title: 'Admin' });
    });

    // app.get('/public/:name', function(req, res) {
    //     res.render('partials/' + req.params.name);
    // });

    /*-----  End of View routes  ------*/

    /*===================================
    =            REST routes            =
    ===================================*/

    var api = require('./mongoApi');

    app.get('/api/posts', ensureAuthenticated, api.posts);
    app.get('/api/post/:slug', ensureAuthenticated, api.post);
    app.post('/api/post', ensureAuthenticated, api.addPost);
    app.put('/api/post/:slug', api.editPost);
    app.delete('/api/post/:slug', api.deletePost);

    /*==========  Public routes  ==========*/

    app.get('/blogPost', api.featurePost);

    app.get('/blog', api.publicPosts);
    app.get('/blog/:slug', api.publicPost);

    /*==========  RSS feed  ==========*/

    app.get('/rss.xml', api.rssFeed);

    /*-----  End of REST routes  ------*/

    /*====================================
    =            Twitter Auth            =
    ====================================*/

    app.get('/auth/twitter', passport.authenticate('twitter'), function(req, res) {
        // The request will be redirected to Twitter for authentication, so this
        // function will not be called.
    });

    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
        res.redirect('/admin');
    });

    /*-----  End of Twitter Auth  ------*/

    // redirect all others to the index (HTML5 history)
    app.get('*', /*ensureAuthenticated,*/ function(req, res) {
        res.render('admin', { user: req.user });
    });
};

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.render('login');
};