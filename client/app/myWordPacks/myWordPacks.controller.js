'use strict';

angular.module('WordRiverApp')
  .controller('MyWordPacksCtrl', function (Auth, $http, $scope) {
    $scope.currentUser = Auth.getCurrentUser();

    //Helper to check if item is in array
    $scope.inArray = function (array, item) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] == item) {
          return true;
        }
      }
      return false;
    };

    $scope.wordsArray = []; //Array of server objects
    $scope.wordsHolder = []; //Array organized to act as desired object

    $scope.getWords = function(){
      $http.get('/api/tile').success(function(words) {
        $scope.wordsArray = [];
        $scope.wordsHolder = [];
        $scope.wordsHolderIDs = [];
        for(var index = 0; index < words.length; index++){
          for(var i = 0; i < $scope.wordsHolder.length; i++){
            $scope.wordsHolderIDs.push($scope.wordsHolder[i]._id);
          }
          if(words[index].userCreated == false){
            if($scope.wordsArray.indexOf(words[index]) == -1){
              $scope.wordsArray.push(words[index]);
            }
            if($scope.wordsHolderIDs.indexOf(words[index]._id) == -1){
              $scope.wordsHolder.push({
                "_id": words[index]._id,
                "name": words[index].name,
                "inContext": false
              });
            }
          } else if($scope.currentUser.words.indexOf(words[index]._id) != -1){
            if($scope.wordsArray.indexOf(words[index]) == -1){
              $scope.wordsArray.push(words[index]);
            }
            if($scope.wordsHolderIDs.indexOf(words[index]._id) == -1){
              $scope.wordsHolder.push({
                "_id": words[index]._id,
                "name": words[index].name,
                "inContext": false
              });
            }
          }
        }
      });
    };
    $scope.getWords();

    $scope.wordPacksHolder = [];  //Array organized to act as desired object
    $scope.wordPacksArray = [];  //Array of server objects

    $scope.getWordPacks = function(){
      $scope.wordPacksHolder = [];
      $scope.wordPacksArray = [];
      $scope.wordPacksHolderIDs = [];
      $http.get('/api/categories/').success(function(wordPacks){
        for(var index = 0; index < wordPacks.length; index++){
          for(var i = 0; i < $scope.wordPacksHolder.length; i++){
            $scope.wordPacksHolderIDs.push($scope.wordPacksHolder[i]._id);
          }
          if(wordPacks[index].creatorID == $scope.currentUser._id){
            if($scope.wordPacksArray.indexOf(wordPacks[index]) == -1){
              $scope.wordPacksArray.push(wordPacks[index]);
            }
            if($scope.wordPacksHolderIDs.indexOf(wordPacks[index]._id) == -1){
              $scope.wordPacksHolder.push({
                "_id": wordPacks[index]._id,
                "name": wordPacks[index].name,
                "words": $scope.getWordsFromWordIDs(wordPacks[index].words),
                "inContext": false
              });
            }
          }
        }
      });
    };

    $scope.getWordsFromWordIDs = function(wordIDs){
      var toReturn = [];
      var toReturnIDs = [];
      for(var index = 0; index < $scope.wordsArray.length; index++) {
        for(var index2 = 0; index2 < wordIDs.length; index2++) {
          if($scope.wordsArray[index]._id == wordIDs[index2]){
            for(var i = 0; i < toReturn.length; i++){
              toReturnIDs.push(toReturn[i]._id);
            }
            if(toReturnIDs.indexOf($scope.wordsArray[index]._id) == -1){
              toReturn.push({
                "_id":$scope.wordsArray[index]._id,
                "name":$scope.wordsArray[index].name,
                "wordType":$scope.wordsArray[index].wordType
              });
            }
          }
        }
      }
      return toReturn;
    };
    $scope.getWordPacks();

    $scope.contextPacksHolder = [];
    $scope.contextPacksArray = [];

    $scope.getContextPacks = function(){
      $scope.contextPacksHolder = [];
      $scope.contextPacksArray = [];
      $scope.contextPacksHolderIDs = [];
      $http.get('/api/contextPacks/').success(function(contextPacks){
        for(var index = 0; index < contextPacks.length; index++){
          for(var i = 0; i < $scope.contextPacksHolder.length; i++){
            $scope.contextPacksHolderIDs.push($scope.contextPacksHolder[i]._id);
          }
          if(contextPacks[index].creatorID == $scope.currentUser._id){
            if($scope.contextPacksArray.indexOf(contextPacks[index]) == -1){
              $scope.contextPacksArray.push(contextPacks[index]);
            }
            if($scope.contextPacksHolderIDs.indexOf(contextPacks[index]._id) == -1){
              $scope.contextPacksHolder.push({
                "_id": contextPacks[index]._id,
                "name": contextPacks[index].name,
                "wordPacks": $scope.getWordPacksFromWordPackIDs(contextPacks[index].wordPacks)
              });
            }
          }
        }
      });
    };

    $scope.getWordPacksFromWordPackIDs = function(wordPackIDs){
      var toReturn = [];
      for(var index = 0; index < $scope.wordPacksHolder.length; index++) {
        for(var index2 = 0; index2 < wordPackIDs.length; index2++) {
          if($scope.wordPacksHolder[index]._id == wordPackIDs[index2] && toReturn.indexOf($scope.wordPacksHolder[index]) == -1){
            $scope.wordPacksHolder[index].inContext = true;
            toReturn.push($scope.wordPacksHolder[index]);
          }
        }
      }
      return toReturn;
    };
    $scope.getContextPacks();
  });
