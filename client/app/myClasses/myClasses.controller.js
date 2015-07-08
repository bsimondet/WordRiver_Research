'use strict';

angular.module('WordRiverApp')
  .controller('JsonFileCtrl', function ($scope, $location, $http, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.classArray = [];
    $scope.groupsArray = [];


    $scope.getClasses = function(){
      $http.get("/api/users/me").success(function(user){
        $scope.classArray = user.classList;
      })
    };

    $scope.getClasses();
  });
