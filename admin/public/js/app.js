'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['ngRoute', 'ngSanitize', 'myApp.filters', 'myApp.services', 'myApp.directives', 'ui.tinymce']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/admin', {
        templateUrl: 'partials/index',
        controller: IndexCtrl
      }).
      when('/admin/add', {
        templateUrl: 'partials/addPost',
        controller: AddPostCtrl
      }).
      when('/admin/edit/:slug', {
        templateUrl: 'partials/editPost',
        controller: EditPostCtrl
      }).
      when('/admin/delete/:slug', {
        templateUrl: 'partials/deletePost',
        controller: DeletePostCtrl
      }).
      // when('/blog', {
      //   templateUrl: 'public/posts',
      //   controller: PostsCtrl
      // }).
      // when('/blog/:slug', {
      //   templateUrl: 'public/readPost',
      //   controller: ReadPostCtrl
      // }).
      otherwise({
        redirectTo: '/admin'
      });
    $locationProvider.html5Mode(true);
  }]);