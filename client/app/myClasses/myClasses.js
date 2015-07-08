'use strict';

angular.module('WordRiverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myClasses', {
        url: '/myClasses',
        templateUrl: 'app/myClasses/myClasses.html',
        controller: 'JsonFileCtrl'
      });
  });
