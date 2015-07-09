'use strict';

angular.module('WordRiverApp')
  .controller('JsonFileCtrl', function ($scope, $location, $http, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.classArray = [];
    $scope.groupsArray = [];
    $scope.isCollapsed = true;
    $scope.hideEdit = true;
    $scope.classToEdit = null;
    $scope.editField = "";

    $scope.getClasses = function(){
      $http.get("/api/users/me").success(function(user){
        $scope.classArray = user.classList;
        $scope.classArray = $scope.checkForDuplicates($scope.classArray);
      })
    };

    $scope.getClasses();

    $scope.findIndexOfClass = function (myclass) {
      for (var i = 0; i < $scope.classArray.length; i++) {
        if (myclass._id == $scope.classArray[i]._id) {
          return i;
        }
      }
    };

    $scope.checkForDuplicates = function(array){
      for (var i = 0; i < array.length; i++) {
        for (var j = i + 1; j < array.length; j++) {
          if (array[i]==array[j]){
            array.splice(j,1);
          }
        }
      }
      return array;
    };

    $scope.editClassName = function (myclass) {
      $scope.editClassIndex = $scope.findIndexOfClass(myclass);
      $scope.hideEdit = false;
      $scope.classToEdit = $scope.classArray[$scope.findIndexOfClass(myclass)];
    };

    //Updates a word in the server when it's edited
    $scope.updateClass = function () {
      //If a word is entered, but the type is not
      if ($scope.editField.length > 0) {
        $http.put('/api/users/' + $scope.currentUser._id + '/updateClassName', {
          classID: $scope.classToEdit._id,
          className: $scope.classToEdit.className
        }).success(function(){
          console.log("updated class name");
          $scope.editField = "";
          $scope.getClasses();
        });
      } else {
        alert("Please enter a new name for this class");
      }
     // $scope.hideEdit = true;
    };

    //Deletes a word from the server and from a user's array of words they've created
    $scope.removeClass = function (myclass) {
      $scope.classToRemove = $scope.classArray[$scope.findIndexOfClass(myclass)];
      $http.put('/api/users/' + $scope.currentUser._id + '/deleteClass',
        {myClassID: $scope.classToRemove._id}
      ).success(function () {
          $scope.getClasses();
          console.log("removed class");
        });
    };
  });
