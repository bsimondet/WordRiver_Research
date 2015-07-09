'use strict';

angular.module('WordRiverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myContextPacks', {
        url: '/myContextPacks',
        templateUrl: 'app/myContextPacks/myContextPacks.html',
        controller: 'MyContextPacksCtrl'
      });
  });
