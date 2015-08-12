'use strict';

angular.module('WordRiverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myWords', {
        url: '/myWords',
        templateUrl: 'app/myWords/myWords.html'
        //controller: 'MyWordsCtrl'
        //This is commented out since we already route our controller through a div in the html
      });
  });
