'use strict';

angular.module('wordRiverAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('json_file', {
        url: '/json_file',
        templateUrl: 'app/json_file/json_file.html',
        controller: 'JsonFileCtrl'
      });
  });