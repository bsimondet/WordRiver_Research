'use strict';

angular.module('WordRiverApp')
  .controller('StudentProfileCtrl', function ($rootScope, $scope, $http, socket, Auth) {
    $scope.currentStudent = $rootScope.currentStudent;
    console.log($scope.currentStudent);
    $scope.studentList = []; //List of user references to students
    $scope.students = []; //List of actual student objects
    $scope.currentUser = Auth.getCurrentUser();
    $scope.selectedStudents = [];

    //$http.get('/api/things').success(function (awesomeThings) {
    //  $scope.students = awesomeThings;
    //  socket.syncUpdates('thing', $scope.students);
    //});

    $scope.getStudentList = function(){
      $scope.studentList = $scope.currentUser.studentList;
    };
    $scope.getStudentList();


    $scope.getStudents = function(){
      for(var i = 0; i < $scope.studentList.length; i++) {
        $http.get("/api/students/" + $scope.studentList[i].studentID).success(function(student) {
          $scope.students.push(student);
        })
      }
    };
    $scope.getStudents();
    //$scope.addThing = function () {
    //  if ($scope.newThing === '') {
    //    return;
    //  }
    //  $http.post('/api/things', {name: $scope.newThing});
    //  $scope.newThing = '';
    //};
    //
    //$scope.deleteThing = function (thing) {
    //  $http.delete('/api/things/' + thing._id);
    //};
    //
    //$scope.$on('$destroy', function () {
    //  socket.unsyncUpdates('thing');
    //});
  });
