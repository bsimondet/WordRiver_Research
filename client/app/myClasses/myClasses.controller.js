'use strict';

angular.module('WordRiverApp')
  .controller('JsonFileCtrl', function ($scope, $location, $http, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.classArray = [];
    $scope.contextPacksArray = [];
    $scope.wordPacksArray = [];
    $scope.wordsArray = [];
    $scope.groupsArray = [];
    $scope.isGroupsCollapsed = false;
    $scope.isStudentsCollapsed = true;
    $scope.isWordsCollapsed = true;
    $scope.isWordPacksCollapsed = true;
    $scope.isContextPacksCollapsed = true;
    $scope.hideEdit = true;
    $scope.viewGroupInfo = true;
    $scope.classToEdit = null;
    $scope.editField = "";
    $scope.currentGroup = null;
    $scope.userStudents = [];
    $scope.studentsInClass = [];
    $scope.studentsInGroup = [];
    $scope.wordsInGroup = [];
    $scope.wordIDsInGroup = [];
    $scope.wordPacksInGroup = [];
    $scope.wordPackIDsInGroup = [];
    $scope.contextPacksInGroup = [];
    $scope.contextPackIDsInGroup = [];


    $scope.inArray = function (array, item) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] == item) {
          return true;
        }
      }
      return false;
    };

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

    $scope.getClasses = function(){
      $http.get("/api/users/me").success(function(user){
        $scope.classArray = [];
        $scope.contextPacksArray = [];
        $scope.classArray = user.classList;
        $scope.contextPacksArray = user.contextPacks;
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
      $scope.userStudents = $scope.checkForDuplicates($scope.userStudents);
    };
    $scope.getStudents();

    $scope.getWordPacks = function(){
      $scope.wordPacksArray = [];
      $http.get('/api/categories/' + $scope.currentUser._id + '/categories').success(function(wordPacks){
        $scope.wordPacksArray = wordPacks;
      });
      $scope.wordPacksArray = $scope.checkForDuplicates($scope.wordPacksArray);
    };
    $scope.getWordPacks();

    $scope.getWords = function(){
      $scope.wordsArray = [];
      $http.get('/api/tile').success(function(tiles) {
        $scope.wordsArray = tiles;
      });
    };
    $scope.getWords();

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
          }
        }
      }
    };

    $scope.viewGroups = function(group){
      $scope.viewGroupInfo = false;
      $scope.contextPacksInGroup = [];
      $scope.wordPacksInGroup = [];
      $scope.wordsInGroup = [];
      //currentGroup is used in html side as well
      $scope.currentGroup = group;
      $scope.getStudentsInGroup($scope.currentGroup);
      $scope.getIDsInGroup($scope.currentGroup);
      $scope.getGroupArray($scope.contextPackIDsInGroup, $scope.contextPacksArray, $scope.contextPacksInGroup);
      $scope.getGroupArray($scope.wordPackIDsInGroup, $scope.wordPacksArray, $scope.wordPacksInGroup);
      //$scope.getGroupArray($scope.wordIDsInGroup, $scope.wordsArray, $scope.wordsInGroup);
      for(var index = 0; index < $scope.wordsArray.length; index++) {
        for (var index2 = 0; index2 < $scope.wordIDsInGroup.length; index2++) {
          if($scope.wordsArray[index]._id == $scope.wordIDsInGroup[index2]) {
            $scope.wordsInGroup.push($scope.wordsArray[index]);
          }
        }
      }
    };

    $scope.getGroupArray = function(idArr, completeArr, returnArr){
      for(var index = 0; index < completeArr.length; index++) {
        for (var index2 = 0; index2 < idArr.length; index2++) {
          if(completeArr[index]._id == idArr[index2]) {
            returnArr.push(completeArr[index]);
          }
        }
      }
    };

    $scope.getStudentsInGroup = function(group){
      $scope.studentsInGroup = [];
      for(var index = 0; index < $scope.userStudents.length; index++){
        for(var index2 = 0; index2 < $scope.userStudents[index].classList.length; index2++){
          for(var index3 = 0; index3 < $scope.userStudents[index].classList[index2].groupList.length; index3++) {
            if ($scope.userStudents[index].classList[index2].groupList[index3] == group._id) {
              $scope.studentsInGroup.push($scope.userStudents[index]);
            }
          }
        }
      }
    };

    $scope.getIDsInGroup = function(group) {
      $scope.contextPacksInGroup = [];
      $scope.wordPackIDsInGroup = [];
      $scope.wordIDsInGroup = [];
      for (var index = 0; index < $scope.classArray.length; index++) {
        for (var index2 = 0; index2 < $scope.classArray[index].groupList.length; index2++) {
          if ($scope.classArray[index].groupList[index2]._id == group._id) {
            $scope.contextPackIDsInGroup = $scope.classArray[index].groupList[index2].contextPacks;
            $scope.wordPackIDsInGroup = $scope.classArray[index].groupList[index2].wordPacks;
            $scope.wordIDsInGroup = $scope.classArray[index].groupList[index2].words;
          }
        }
      }
    };
  });
