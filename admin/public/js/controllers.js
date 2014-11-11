'use strict';

/* Controllers */

function navCtrl($scope, $http, $location) {
  $scope.getClass = function(path) {
      if ($location.path().substr(0, path.length) == path) {
        // console.log('getClass');
        return "current active"
      } else {
        return ""
      }
  }
}

function IndexCtrl($scope, $http, $location) {
  $http.get('/api/posts').
    success(function(data, status, headers, config) {
      console.log('Index data: ', data);
      $scope.posts = data.posts;
    });

    $scope.addPost = function() {
      $location.path('/admin/add');
    }

    $scope.currentPage = 0;
    $scope.pageSize = 10;
}

function AddPostCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.form.content = "Replace me with your content...";
  console.log('Add Post Load: ', $scope.form);
  $scope.statuses = [
    { value: 'Draft', name: 'Draft'},
    { value: 'Publish', name: 'Publish'},
    { value: 'Feature', name: 'Feature'}
  ];

  $scope.change = function() {
    var slug = $scope.form.meta.title;
    $scope.form.filename = slug.replace(/\s/g, '-').toLowerCase();
    console.log($scope.form.filename);
  };

  $scope.submitPost = function () {
    console.log($scope.form);
    $http.post('/api/post', $scope.form).
      success(function(data) {
        $location.path('/admin');
      });
  };
}

function EditPostCtrl($scope, $http, $location, $routeParams) {
  console.log('route params: ', $routeParams);
  $scope.statuses = [
    { value: 'Draft', name: 'Draft'},
    { value: 'Publish', name: 'Publish'},
    { value: 'Feature', name: 'Feature'}
  ];
  // $scope.form.meta.status = $scope.statuses[1];

  $scope.form = {};
  // $http.get('/api/post/' + $routeParams.id).
  $http.get('/api/post/' + $routeParams.slug).
    success(function(data) {
      console.log('data: ', data);
      $scope.form = data.post;
    });

  $scope.editPost = function () {
    if(typeof $scope.form.meta.tags !== 'string') {
      $scope.form.meta.tags = $scope.form.meta.tags.join();
    }
    console.log('EDIT: ', $scope.form);
    // $http.put('/api/post/' + $routeParams.id, $scope.form).
    $http.put('/api/post/' + $routeParams.slug, $scope.form).
      success(function(data) {
        // $location.url('/api/post/' + $routeParams.id);
        $location.url('/api/post/' + $routeParams.slug);
      });
  };

  $scope.deletePost = function () {
    console.log('delete: ', $routeParams.slug);
    $location.url('/admin/delete/' + $routeParams.slug);
  }
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.slug).
    success(function(data) {
      console.log('delete data: ', data);
      $scope.post = data.post;
    });

  $scope.deletePost = function () {
    $http.delete('/api/post/' + $routeParams.slug).
      success(function(data) {
        $location.url('/admin');
      });
  };

  $scope.home = function () {
    $location.url('/admin');
  };
}

function PostsCtrl($scope, $http, $routeParams) {
  console.log('in posts');
  $http.get('/api/publicPosts').
  success(function(data, status, headers, config) {
    console.log(data.posts);
    $scope.posts = data.posts;
  });
}

function ReadPostCtrl($scope, $http, $routeParams) {
  console.log('in post');
  $http.get('/api/post/' + $routeParams.slug).
    success(function(data) {
      console.log('post data: ', data.post)
      $scope.post = data.post;
    });
}
