'use strict';

angular.module('WordRiverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myStudents', {
        url: '/myStudents',
        templateUrl: 'app/myStudents/myStudents.html'
        //controller: 'MyStudentsCtrl'
        //This is commented out since we already route our controller through a div in the html
      });
  });
