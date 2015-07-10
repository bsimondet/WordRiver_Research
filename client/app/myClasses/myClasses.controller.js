'use strict';

angular.module('WordRiverApp')
  .controller('JsonFileCtrl', function ($scope, $location, $http, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.classArray = [];
    $scope.groupsArray = [];
    $scope.isGroupsCollapsed = true;
    $scope.isStudentsCollapsed = true;
    $scope.hideEdit = true;
    $scope.classToEdit = null;
    $scope.editField = "";
    $scope.viewGroupInfo = false;
    $scope.currentGroup = null;
    $scope.userStudents = [];
    $scope.studentsInClass = [];

    $scope.getClasses = function(){
      $http.get("/api/users/me").success(function(user){
        $scope.classArray = user.classList;
        $scope.classArray = $scope.checkForDuplicates($scope.classArray);
      })
    };

    $scope.getClasses();

    $scope.getStudents = function(){
      $scope.userStudents = [];
      $http.get("/api/students").success(function(allStudents) {
        for(var i = 0; i < allStudents.length; i++) {
          if ($scope.inArray(allStudents[i].teachers, $scope.currentUser._id)) {
            $scope.userStudents.push(allStudents[i]);
          }
        }
      });
    };
    $scope.getStudents();

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
      console.log($scope.editField);
      if ($scope.editField.length > 0) {
        $http.put('/api/users/' + $scope.currentUser._id + '/class', {
          classID: $scope.classArray[$scope.editClassIndex]._id,
          className: $scope.editField
        }).success(function(){
          $scope.editField = "";
          $scope.getClasses();
          $scope.hideEdit = true;
        });
      } else {
        alert("Please enter a new name for this class");
      }
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

    $scope.viewStudents = function(classID){
      $scope.studentsInClass = [];
      for(var index = 0; index < $scope.userStudents.length; index++){
        for(var index2 = 0; index2 < $scope.userStudents[index].classList.length; index2++){
          if($scope.userStudents[index].classList[index2]._id == classID){
            $scope.studentsInClass.push($scope.userStudents[index]);
            console.log($scope.userStudents[index].firstName);
          }
        }
      }
    };

    $scope.inArray= function(array, item){
      for(var i = 0; i < array.length; i++){
        if(array[i] == item){
          return true;
        }
      }
      return false;
    };
  });
