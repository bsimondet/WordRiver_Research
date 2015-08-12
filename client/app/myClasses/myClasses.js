'use strict';

angular.module('WordRiverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myClasses', {
        url: '/myClasses',
        templateUrl: 'app/myClasses/myClasses.html'
        //controller: 'MyClassesCtrl'
        //This is commented out since we already route our controller through a div in the html
      });
  });
