
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('admin', {user: req.user, title: 'Admin'});
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name, {user: req.user, title: 'Admin'});
};

exports.login =  function(req, res) {
    // console.dir(req);
    res.render('login', {user: req.user});
};