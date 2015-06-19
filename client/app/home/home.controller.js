'use strict';

angular.module('WordRiverApp')
  .controller('HomeCtrl', function ($scope, $rootScope, Auth, $location) {
    //$scope.user = {email: "rosemariemaxwell@plexia.com", password: "joethe"};
    $scope.errors = {};
    $scope.logInShow = true;
    $scope.signUpShow = false;
    //Changed to true to skip login
    $scope.signedInShow = true;
    $scope.buttonsShow = true;
    $scope.changePasswordShow = false;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.backgroundImage = {
      background: "url(assets/images/river.jpg) no-repeat center",
      "background-attachment": "scroll"
    };

    $scope.checkChangePassword = function() {
      var values = $location.absUrl().split("=");
      console.log(values);
      if(values[1] == "true"){
        $scope.changePasswordShow = true;
        //Changed to true to skip login
        $scope.signedInShow = true;
        $scope.buttonsShow = false;
        $scope.logInShow = false;
        $scope.signUpShow = false;
      }
    };

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
          .then( function() {
            $scope.signedInShow = true;
            $scope.buttonsShow = false;
            $scope.logInShow = false;
            $scope.signUpShow = false;
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
            $scope.signedInShow = true;
            $scope.buttonsShow = false;
            $scope.logInShow = false;
            $scope.signUpShow = false;
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

    $scope.checkedLoggedIn = function() {
      if(Auth.isLoggedIn()){
        $scope.signedInShow = true;
        $scope.buttonsShow = false;
        $scope.logInShow = false;
        $scope.signUpShow = false;
      }else{
        $scope.logInShow = true;
        $scope.signUpShow = false;
        $scope.signedInShow = false;
        $scope.buttonsShow = true;
      }
    }

    $scope.checkedLoggedIn();

    $scope.checkChangePassword();


    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
          .then( function() {
            $scope.message = 'Password successfully changed.';
          })
          .catch( function() {
            form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'Incorrect password';
            $scope.message = '';
          });
      }
    };


  });
