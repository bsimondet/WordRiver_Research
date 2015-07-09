'use strict';

angular.module('WordRiverApp')
  .controller('MyWordsCtrl', function ($scope, $http, socket, Auth) {
    $scope.allWords = []; //a list of all words from the database
    $scope.userWords = []; //words that teacher has added
    $scope.userWordIDs = []; //words that teacher has added

    $scope.getAllWords = function () {
      $http.get('/api/tile').success(function (allWords) {
        $scope.allWords = allWords;
      });
    };


    $scope.getAllWords();

    $scope.getUserWords = function(){
      $scope.userWordIDs = [];
      $http.get("/api/users/me").success(function(user){
        $scope.userWordIDs = user.words;
        for(var index = 0; index < $scope.allWords.length; index++){
          for(var index2 = 0; index2 < $scope.userWordIDs.length; index2++){
            if($scope.allWords[index]._id == $scope.userWordIDs[index2]){
              $scope.userWords.push($scope.allWords[index]);
            }
          }
        }
      })
    };

    $scope.getUserWords();

  });
