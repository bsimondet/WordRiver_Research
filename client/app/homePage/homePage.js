'use strict';

angular.module('WordRiverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('homePage', {
        url: '/homePage',
        templateUrl: 'app/homePage/homePage.html',
        controller: 'JsonFileCtrl'
      });
  });
