'use strict';

angular.module('WordRiverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myWordPacks', {
        url: '/myWordPacks',
        templateUrl: 'app/myWordPacks/myWordPacks.html'
        //controller: 'MyWordPacksCtrl'
        //This is commented out since we already route our controller through a div in the html
      });
  });
