'use strict';

angular.module('WordRiverApp')
  .controller('MyStudentsCtrl', function ($scope, $location, $http, Auth) {
    $scope.myStudents = []; //List of actual student objects
    $scope.currentUser = Auth.getCurrentUser();

    $scope.getStudents = function(){
      $http.get("/api/students").success(function(myStudents) {
        for(var i = 0; i < myStudents.length; i++){
          if($scope.inArray(myStudents[i].teachers, $scope.currentUser._id)){
            $scope.myStudents.push(myStudents[i]);
          }
        }
      });
    };

    $scope.getStudents();

    $scope.inArray= function(array, item){
      for(var i = 0; i < array.length; i++){
        if(array[i] == item){
          return true;
        }
      }
      return false;
    };
  });
