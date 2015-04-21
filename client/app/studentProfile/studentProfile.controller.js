'use strict';

angular.module('WordRiverApp')
  .controller('StudentProfileCtrl', function ($rootScope, $scope, $http, socket, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.currentStudent = $rootScope.currentStudent;

    console.log($scope.currentStudent);

    $scope.studentList = $scope.currentUser.studentList; //List of user references to students
    $scope.students = []; //List of actual student objects

    $scope.selectedStudents = [];

    $scope.currentCategory = null;
    $scope.categoryArray = [];

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
            if(allCategories[j]._id == $scope.selectedStudent.contextTags[i].tagName){
              $scope.categoryArray.push(allCategories[i].name);
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
    //};

    $scope.getStudents = function(){
      for(var i = 0; i < $scope.studentList.length; i++) {
        $http.get("/api/students/" + $scope.studentList[i].studentID).success(function(student) {
          $scope.students.push(student);
        })
      }
    };

    $scope.getStudents();

  $scope.AllTiles = [];
    $scope.getTiles = function(){
        $http.get("/api/tiles/" ).success(function(tile) {
          $scope.AllTiles.push(tile);
        })
    };
    $scope.getTiles();


    $scope.tiles = [];
    $scope.displayStudentProfile = function(student){
      $scope.tilesID = [];
      $scope.selectedStudent = student;
      $scope.tilesID = $scope.selectedStudent.tileBucket;
      $scope.getCategories(student);
      $scope.hide = false;
      //for (var i=0; $scope.tilesID.length; i++) {
      //  $scope.tilename = document.getElementById("tilesID[i]");
      //  $scope.tiles.push($scope.tilename);
      //  for (var j = 0; j < $scope.AllTiles.length; j++) {
      //    if ($scope.tilesID[i] == $scope.AllTiles[j]._id){
      //      $scope.tiles.push($scope.AllTiles[j].name);
      //    }
      //  }
      //  }
      };
      //for(var i = 0; i < $scope.studentList.length; i++){
      //  if($scope.studentList[i].groupList.indexOf(group.groupName) != -1){
      //    $scope.studentsInGroup.push($scope.studentList[i]);
      //  }
      //}


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
