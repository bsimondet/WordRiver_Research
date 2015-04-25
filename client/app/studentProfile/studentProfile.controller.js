'use strict';

angular.module('WordRiverApp')
  .controller('StudentProfileCtrl', function ($rootScope, $scope, $http, socket, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
    //$scope.currentStudent = $rootScope.currentStudent;

    //console.log($scope.currentStudent);

    $scope.students = []; //List of actual student objects
    $scope.studentGroups = [];
    $scope.selectedStudents = [];
    $scope.teacherGroups = [];
    $scope.categoryArray = [];
    $scope.wordArray = [];
    $scope.hide = true;

    //$scope.getStudentList = function(){
    //  $scope.studentList = $scope.currentUser.studentList;
    //};
    //$scope.getStudentList();
    //

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

    $scope.getElementsByID = function(idArray, objectArray, resultArray){
      for (var i = 0; i < idArray.length; i++) {
        for(var j = 0; j < objectArray.length; j++){
          console.log(objectArray[i]._id);
          if(objectArray[j]._id == idArray[i]){
            resultArray.push(objectArray[i]);
            console.log("result: " + resultArray);
          }
        }
      }
    };


    $scope.getCategories = function(student) {
      $scope.categoryArray = [];
      $http.get('/api/categories').success(function (allCategories) {
 //       console.log(allCategories);
        $scope.getElementsByID(student.contextTags, allCategories,$scope.categoryArray);
 //       for (var i = 0; i < student.contextTags.length; i++) {
 //         for(var j = 0; j < allCategories.length; j++){
 //           if(allCategories[j]._id == student.contextTags[i]){
 //             $scope.categoryArray.push(allCategories[j].name);
 //           }
 //         }
 //       }
      });
    };

    $scope.getWords = function(student) {
      $scope.wordArray = [];
      $http.get('/api/tile').success(function (allWords) {
  //      console.log(allWords);
        for (var i = 0; i < student.tileBucket.length; i++) {
          for(var j = 0; j < allWords.length; j++){
            if(allWords[j]._id == student.tileBucket[i]){
              $scope.wordArray.push(allWords[j].name);
            }
          }
        }
      });
    };


    //$scope.searchCategories = function() {
    //  for (var i = 0; i < $scope.selectedStudent.contextTags.length; i++){
    //    for (var j = 0; j < categoryArray.length; j++){
    //      if ($scope.selectedStudent.contextTags[i] == $scope.categoryArray[j].name){
    //      }
    //    }
    //  }
    //};.studentID

    $scope.getStudents = function(){
        $http.get("/api/students/").success(function(student) {
          for (var i = 0; i < $scope.currentUser.studentList.length; i++) {
            for (var j = 0; j < student.length; j++) {
              if (student[j]._id == $scope.currentUser.studentList[i]) {
                $scope.students.push(student[j]);
              }
            }
          }
        })
    };

    $scope.getStudents();

    $scope.displayStudentProfile = function(student){

      $scope.tilesID = [];
      $scope.selectedStudent = student;
      $scope.tilesID = $scope.selectedStudent.tileBucket;
      $scope.getCategories(student);
      $scope.getWords(student);
      $scope.hide = false;
      //$scope.getTeacherGroups(student);
      //$scope.getStudentGroups(student);

    };



    //$scope.addThing = function () {
    //  if ($scope.newThing === '') {
    //    return;
    //  }Student
    //  $http.post('/api/things', {name: $scope.newThing});
    //  $scope.newThing = '';
    //};Student
    //
    //$scope.deleteThing = function (thing) {
    //  $http.delete('/api/things/' + thing._id);
    //};
    //
    //$scope.$on('$destroy', function () {
    //  socket.unsyncUpdates('thing');
    //});
  });
