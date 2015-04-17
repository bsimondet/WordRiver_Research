'use strict';

angular.module('WordRiverApp')
  .controller('HomeCtrl', function ($scope, Auth, $location) {
    $scope.user = {email: "rosemariemaxwell@plexia.com", password: "culpa"};
    $scope.errors = {};
    $scope.logInShow = true;
    $scope.signUpShow = false;
    $scope.signedInShow = false;
    $scope.buttonsShow = false;
    $scope.backgroundImage = {
      background: "url(assets/images/river.jpg) no-repeat center",
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
            $location.path('/');
          });
      }
    };
    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
          .then( function() {
            // Account created, redirect to home
            $location.path('/');
          })
          .catch( function(err) {
            err = err.data;
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });
      }
    };
  });
