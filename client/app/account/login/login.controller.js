'use strict';

angular.module('WordRiverApp')
  .controller('LoginCtrl', function ($scope, Auth, $location) {
    $scope.user = {email: "rosemariemaxwell@plexia.com", password: "joethe"};
    $scope.errors = {};

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
    $scope.loginOauth = function(provider){
      this.$window.location.href = '/auth/' + provider;
    };
  });
