'use strict';

angular.module('WordRiverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myWordPacks', {
        url: '/myWordPacks',
        templateUrl: 'app/myWordPacks/myWordPacks.html',
        controller: 'MyWordPacksCtrl'
      });
  });
