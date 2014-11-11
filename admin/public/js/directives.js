'use strict';

/* Directives */

// angular.module('myApp.directives', []).
//     directive('ckEditor', function() {
//         return {
//             require: '?ngModel',
//             link: function(scope, elm, attr, ngModel) {
//                 console.log('in link');

//                 var ck = CKEDITOR.replace(elm[0]);

//                 if(!ngModel) {
//                     console.log('in no model');
//                 }

//                 ck.on('pasteState', function() {
//                     scope.$apply(function() {
//                         ngModel.$setViewValue(ck.getData());
//                     });
//                 });

//                 ck.on('instanceReady', function() {
//                     console.log('in instanceReady and ck.getData() is:', ck.getData());
//                     scope.$apply(function() {
//                         ngModel.$setViewValue(ck.getData());
//                     });
//                 });

//                 scope.$watch('form.content', function(content) {
//                     console.log('content: ', content);
//                     ck.setData(content);
//                     ngModel.$setViewValue(content);
//                 });

//                 ngModel.$render = function(value) {
//                     console.log('in render and value is: ', value);
//                     ck.setData(ngModel.$viewValue);
//                 }
//             }
//         }
//     });

// default directive
//
angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

// angular.module('myApp.directives', [])
//   .directive('shareButton', function() {
//     return {
//       restrict: 'A',
//       link: function($scope, $elem, $attrs) {
//         $($elem).share();
//       }
//     }
//   });

angular.module('myApp.directives', [])
  .directive('stickyNav', function() {
    return {
      restrict: 'A',
      link: function($scope, $element, $attrs) {
          $($element).waypoint('sticky');
          // console.log('element: ', $element);
          // console.log('scope: ', $scope);
          // console.log('attrs: ', $attrs)
      }
    }
  })
  .directive('shareButton', function() {
    return {
      restrict: 'A',
      link: function($scope, $elem, $attrs) {
        console.log('attrs: ', $attrs);
        console.log('scope: ', $scope);
        $scope.$watch('post', function(post){
          console.log('post', post);
          if(post){
            $($elem).share({
              url: 'www.justinglock.com/blog/' + post.filename,
              text: "Check out Justin Glock's new article...",
              image: post.meta.featureImage
              // facebook: {
              //   name: post.meta.title,
              //   link: 'www.justinglock.com/blog/' + post.filename,
              //   image: post.meta.featureImage,
              //   text: post.meta.description
              // },
              // twitter: {
              //   text: "Check out Justin Glock's new article...",
              //   url: 'www.justinglock.com/blog/' + post.filename
              // },
              // gplus: {
              //   link: 'www.justinglock.com/blog/' + post.filename
              // }
            });
          }
        });
      }
    }
  });
