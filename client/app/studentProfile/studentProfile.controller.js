'use strict';

angular.module('WordRiverApp')
  .controller('StudentProfileCtrl', function ($rootScope, $scope, $http, socket, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.students = []; //List of actual student objects
    $scope.studentGroups = [];
    $scope.selectedStudents = [];
    //$scope.teacherGroups = [];
    $scope.categoryArray = [];
    $scope.wordArray = [];
    $scope.hide = true;
    $scope.holdCatID = [];



    // Code for groups that we may or may not use

    //$scope.getTeacherGroups = function(student) {
    //  $scope.teacherGroups = [];
    //  $http.get('/api/users').success(function (user) {
    //    for (var i = 0; i < student.teachers.length; i++) {
    //      for(var j = 0; j < user.length; j++){
    //        if(user[j]._id == student.teachers[i]){
    //          $scope.teacherGroups.push(user[j].groupList);
    //        }
    //      }
    //    }
    //  });
    //};
    //
    //$scope.getStudentGroups = function(student) {
    //  console.log("Groups: " + $scope.teacherGroups);
    //  $scope.studentGroups = [];
    //  for (var i = 0; i < student.groupList.length; i++) {
    //    for(var j = 0; j < $scope.teacherGroups.length; j++){
    //      if($scope.teacherGroups[j]._id == student.groupList[i]){
    //        $scope.studentGroups.push($scope.teacherGroups[j].groupName);
    //      }
    //    }
    //  }
    //};

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

    $scope.getElementsByID = function(idArray, objectArray, resultArray){
      for (var i = 0; i < idArray.length; i++) {
        for(var j = 0; j < objectArray.length; j++){
          if(objectArray[j]._id == idArray[i]){
            resultArray.push(objectArray[j]);
          }
        }
      }
      $scope.checkForDuplicates(resultArray);
    };

    $scope.getGroups = function(student) {
      $scope.studentGroups = [];
      $http.get('/api/users/me').success(function (user) {
        $scope.getElementsByID(student.groupList, user.groupList, $scope.studentGroups);
//TODO: Make it so allll categories and words are displayed, not just indiviually assigned ones.
/*        console.log($scope.studentGroups.length);
        for(var index = 0; index < $scope.studentGroups.length; index++) {
          console.log($scope.studentGroups[index].contextPacks.length);
          for (var index2 = 0; index2 < $scope.studentGroups[index].contextPacks.length; index2++) {
            $scope.holdCatID.push(student.groupList[index].contextPacks[index2]._id);
          }
        }*/
      });
    };

    $scope.getCategories = function(student) {
      $scope.categoryArray = [];
      $http.get('/api/categories').success(function (allCategories) {
        $scope.getElementsByID(student.contextTags, allCategories, $scope.categoryArray);
      });
    };

    $scope.getWords = function(student) {
      $scope.wordArray = [];
      $http.get('/api/tile').success(function (allWords) {
        $scope.getElementsByID(student.tileBucket, allWords, $scope.wordArray);
      });
    };



    $scope.getStudents = function(){
        $http.get("/api/students/").success(function(student) {
          $scope.getElementsByID($scope.currentUser.studentList, student, $scope.students);
        })
    };
    $scope.getStudents();


    $scope.displayStudentProfile = function(student){
      $scope.selectedStudent = student;
      $scope.getCategories(student);
      $scope.getWords(student);
      $scope.hide = false;
      $scope.getGroups(student);
      //$scope.getTeacherGroups(student);
      //$scope.getStudentGroups(student);

    };



  });
