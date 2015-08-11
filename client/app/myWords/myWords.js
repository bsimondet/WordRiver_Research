'use strict';

angular.module('WordRiverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myWords', {
        url: '/myWords',
        templateUrl: 'app/myWords/myWords.html'
        //controller: 'MyWordsCtrl'
      });
  });
