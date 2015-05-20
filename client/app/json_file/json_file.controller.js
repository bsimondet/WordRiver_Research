'use strict';

angular.module('WordRiverApp')
  .controller('JsonFileCtrl', function ($scope, $http) {
    $scope.allTiles = [];

    $scope.getWords = function(){
      $scope.userTiles = [];
      $http.get('/api/tile').success(function(allTiles) {
        $scope.allTiles = allTiles;
        /*        for(var i= 0; i < $scope.allTiles.length; i++){
         if($scope.currentUser._id == $scope.allTiles[i].creatorID){
         $scope.userTiles.push($scope.allTiles[i]);
         //console.log($scope.allTiles[i]);
         }
         }*/
      });
    };
    $scope.getWords();
  });
