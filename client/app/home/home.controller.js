'use strict';

angular.module('WordRiverApp')
  .controller('HomeCtrl', function ($scope, Auth, $location) {
    $scope.user = {email: "rosemariemaxwell@plexia.com", password: "culpa"};
    $scope.errors = {};

    $scope.backgroundImage = {
      background: "url(assets/images/river.jpg) no-repeat bottom",
      "background-attachment": "scroll"
    };

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
          .then( function() {
            // Logged in, redirect to home
            $location.path('/');
          })
          .catch( function(err) {
            $scope.errors.other = err.message;
          });
      }
    };

  });
