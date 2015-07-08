'use strict';

angular.module('WordRiverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myStudents', {
        url: '/myStudents',
        templateUrl: 'app/myStudents/myStudents.html',
        controller: 'JsonFileCtrl'
      });
  });
