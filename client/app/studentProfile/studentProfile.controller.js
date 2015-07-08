'use strict';

angular.module('WordRiverApp')
  .controller('StudentProfileCtrl', function ($rootScope, $scope, $http, socket, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.students = []; //List of actual student objects
    $scope.studentClasses = [];
    $scope.selectedStudents = [];
    //$scope.teacherGroups = [];
    $scope.wordPackArray = [];
    $scope.wordArray = [];
    $scope.hide = true;
    $scope.tempCategoryArray = [];

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

    //Get students that are in the current teacher's array of student IDs
    $scope.getStudents = function(){
      $http.get("/api/students/").success(function(student) {
        $scope.getElementsByID($scope.currentUser.studentList, student, $scope.students);
      })
    };
    $scope.getStudents();

    //Get groups that are in the current teacher's array of groups && are assigned to the current student
    $scope.getGroups = function(student) {
      $scope.studentClasses = [];
      $scope.tempCategoryArray = [];
      $http.get('/api/users/me').success(function (user) {
        $scope.getElementsByID(student.groupList, user.groupList, $scope.studentClasses);
        //$scope.getCategoriesFromGroups($scope.studentClasses);
      });
    };

    //TODO: Make it so all categories and words display related to groups
/*    $scope.getCategoriesFromGroups = function(groups){
      for (var i = 0; i < groups.length; i++) {
        for (var x = 0; x < groups[i].wordPacks.length; x++) {
          $scope.tempCategoryArray.push(groups[i].wordPacks[x]);
        }
      }
    };*/

    $scope.getCategories = function(student) {
      $scope.wordPackArray = [];
      $http.get('/api/categories').success(function (allCategories) {
        $scope.getElementsByID(student.wordPacks, allCategories, $scope.wordPackArray);
      });
    };

    $scope.getWords = function(student) {
      $scope.wordArray = [];
      $http.get('/api/tile').success(function (allWords) {
        $scope.getElementsByID(student.tileBucket, allWords, $scope.wordArray);
      });
    };




    $scope.displayStudentProfile = function(student){
      $scope.selectedStudent = student;
      $scope.getGroups(student);
      $scope.getCategories(student);
      $scope.getWords(student);
      $scope.hide = false;
      //$scope.getTeacherGroups(student);
      //$scope.getStudentGroups(student);

    };



  });
