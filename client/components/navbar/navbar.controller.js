'use strict';

angular.module('WordRiverApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      window.location = "/";
    };

    $scope.goHome = function(){
      window.location = "/";
    };

    //this function activates a variable that sends the user to the home page rather than a seperate settings page
    $scope.changePassword = function(){
      window.location = "/?changePassword=true";
    };

    $scope.refreshPage = function(){
      location.reload();
    };



    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
