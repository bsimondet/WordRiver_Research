'use strict';

angular.module('WordRiverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('studentProfile', {
        url: '/studentProfile',
        templateUrl: 'app/studentProfile/studentProfile.html',
        controller: 'StudentProfileCtrl'
      });
  });
