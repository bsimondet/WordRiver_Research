'use strict';

angular.module('wordRiverAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myStudents', {
        url: '/myStudents',
        templateUrl: 'app/myStudents/myStudents.html',
        controller: 'MyStudentsCtrl'
      });
  });