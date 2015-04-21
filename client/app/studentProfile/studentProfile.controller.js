'use strict';

angular.module('WordRiverApp')
  .controller('StudentProfileCtrl', function ($rootScope, $scope, $http, socket, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
    //$scope.currentStudent = $rootScope.currentStudent;

    //console.log($scope.currentStudent);

    $scope.students = []; //List of actual student objects

    $scope.selectedStudents = [];

    $scope.currentCategory = null;
    $scope.categoryArray = [];
    $scope.wordArray = [];
    $scope.hide = true;

    //$scope.getStudentList = function(){
    //  $scope.studentList = $scope.currentUser.studentList;
    //};
    //$scope.getStudentList();
    //



    $scope.getCategories = function(student) {
      $scope.categoryArray = [];
      $scope.selectedStudent = student;
      $http.get('/api/categories').success(function (allCategories) {
        console.log(allCategories);
        for (var i = 0; i < $scope.selectedStudent.contextTags.length; i++) {
          for(var j = 0; j < allCategories.length; j++){
            if(allCategories[j]._id == $scope.selectedStudent.contextTags[i]){
              $scope.categoryArray.push(allCategories[i].name);
            }
          }
        }
      });
    };


    $scope.getWords = function(student) {
      $scope.wordArray = [];
      $scope.selectedStudent = student;
      $http.get('/api/tile').success(function (allWords) {
        console.log(allWords);
        for (var i = 0; i < $scope.selectedStudent.tileBucket.length; i++) {
          for(var j = 0; j < allWords.length; j++){
            if(allWords[j]._id == $scope.selectedStudent.tileBucket[i]){
              $scope.wordArray.push(allWords[i].name);
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
      for(var i = 0; i < $scope.currentUser.studentList.length; i++) {
        $http.get("/api/students/").success(function(student) {
          for (var i = 0; i < $scope.currentUser.studentList.length; i++) {
            for (var j = 0; j < student.length; j++) {
              if (student[j]._id == $scope.currentUser.studentList[i]) {
                $scope.students.push(student[i]);
              }
            }
          }
        })
      }
    };

    $scope.getStudents();

    $scope.displayStudentProfile = function(student){

      $scope.tilesID = [];
      $scope.selectedStudent = student;
      $scope.tilesID = $scope.selectedStudent.tileBucket;
      $scope.getCategories(student);
      $scope.getWords(student);
      $scope.hide = false;

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
