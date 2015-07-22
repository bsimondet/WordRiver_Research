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
    $scope.wordPacksNonContextHolder = [];  //Array organized to act as desired object
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
        $scope.getNonContextWordPacks();
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

    $scope.getNonContextWordPacks = function(){
      $scope.wordPacksNonContextHolder = [];
      for(var i = 0; i < $scope.wordPacksHolder.length; i++){
        if($scope.wordPacksHolder[i].inContext == false && $scope.wordPacksNonContextHolder.indexOf($scope.wordPacksHolder[i]) == -1){
          $scope.wordPacksNonContextHolder.push($scope.wordPacksHolder[i]);
        }
      }
    };

    $scope.getContextPacks();

    $scope.viewMyContextPacks = false;
    $scope.viewAllOfMyWordPacks = false;
    $scope.viewMyNonContextWordPacks = false;
    $scope.viewWordPackWords = false;

    $scope.toggleView = function(view){
      if(view == 'context'){
        $scope.viewMyContextPacks = true;
        $scope.viewAllOfMyWordPacks = false;
        $scope.viewMyNonContextWordPacks = false;
        $scope.viewWordPackWords = false;
        $scope.viewEditWordPackName = false;
        $scope.viewCreateWordPack = false;
        $scope.createWordPackForContext = false;
      } else if(view == 'all'){
        $scope.viewMyContextPacks = false;
        $scope.viewAllOfMyWordPacks = true;
        $scope.viewMyNonContextWordPacks = false;
        $scope.viewWordPackWords = false;
        $scope.viewEditWordPackName = false;
        $scope.viewCreateWordPack = false;
        $scope.createWordPackForContext = false;
      } else if(view == 'indiv'){
        $scope.viewMyContextPacks = false;
        $scope.viewAllOfMyWordPacks = false;
        $scope.viewMyNonContextWordPacks = true;
        $scope.viewWordPackWords = false;
        $scope.viewEditWordPackName = false;
        $scope.viewCreateWordPack = false;
        $scope.createWordPackForContext = false;
      }
    };

    //For editing a context pack name
    $scope.viewEditContextName = false;
    $scope.contextToEdit = null;
    $scope.editContextName = "";

    $scope.editContextName = function (context) {
      $scope.viewEditWordPackName = false;
      $scope.viewWordPackWords = false;
      $scope.viewEditContextName = true;
      $scope.contextToEditName = context.name;
      $scope.contextToEdit = context;
      $scope.viewCreateWordPack = false;
      $scope.createWordPackForContext = false;
    };

    $scope.updateContextName = function () {
      if ($scope.editContextName.length > 0) {
        $http.put('/api/contextPacks/' + $scope.contextToEdit._id + '/editContextName', {
          contextID: $scope.contextToEdit._id,
          name: $scope.editContextNameField
        }).success(function(){
          $scope.editContextNameField = "";
          $scope.getContextPacks();
          $scope.viewEditContextName = false;
        });
      } else {
        alert("Please enter a new name for this context pack");
      }
    };

    //For editing a word pack name
    $scope.viewEditWordPackName = false;
    $scope.wordPackToEdit = null;
    $scope.editWordPackName = "";

    $scope.editWordPackName = function (wordPack) {
      $scope.viewEditContextName = false;
      $scope.viewWordPackWords = false;
      $scope.viewEditWordPackName = true;
      $scope.wordPackToEditName = wordPack.name;
      $scope.wordPackToEdit = wordPack;
      $scope.viewCreateWordPack = false;
      $scope.createWordPackForContext = false;
    };

    $scope.updateWordPackName = function () {
      if ($scope.editWordPackName.length > 0) {
        $http.put('/api/categories/' + $scope.wordPackToEdit._id + '/editWordPackName', {
          wordPackID: $scope.wordPackToEdit._id,
          name: $scope.editWordPackNameField
        }).success(function(){
          for(var i = 0; i < $scope.contextPacksHolder.length; i++){
            for(var j = 0; j < $scope.contextPacksHolder[i].wordPacks.length; j++){
              if($scope.contextPacksHolder[i].wordPacks[j]._id == $scope.wordPackToEdit._id){
                $scope.contextPacksHolder[i].wordPacks[j].name = $scope.editWordPackNameField;
              }
            }
          }
          for(var k = 0; k < $scope.wordPacksHolder.length; k++){
            if($scope.wordPacksHolder[k]._id == $scope.wordPackToEdit._id){
              $scope.wordPacksHolder[k].name = $scope.editWordPackNameField;
            }
          }
          for(var l = 0; l < $scope.wordPacksNonContextHolder.length; l++){
            if($scope.wordPacksNonContextHolder[l]._id == $scope.wordPackToEdit._id){
              $scope.wordPacksNonContextHolder[l].name = $scope.editWordPackNameField;
            }
          }
          $scope.editWordPackNameField = "";
          $scope.viewEditWordPackName = false;
        });
      } else {
        alert("Please enter a new name for this word pack");
      }
    };

    $scope.viewCreateWordPack = false;
    $scope.createWordPackForContext = false;
    $scope.currentContextPack = null;

    $scope.newWordPack = function(item){
      $scope.viewCreateWordPack = true;
      if(item != null){
        $scope.currentContextPack = item;
        $scope.createWordPackForContext = true;
      }
    };

    $scope.createWordPack = function () {
      if ($scope.createWordPackNameField.length > 0) {
        $http.post('/api/categories/', {
          name: $scope.createWordPackNameField,
          creatorID: $scope.currentUser._id
        }).success(function(newWordPack){
          $scope.wordPacksHolder.push({
            "_id":newWordPack._id,
            "name":newWordPack.name,
            "inContext": false
          });
          $scope.wordPacksNonContextHolder.push({
            "_id":newWordPack._id,
            "name":newWordPack.name,
            "inContext": false
          });
          if($scope.createWordPackForContext){
            for(var i = 0; i < $scope.contextPacksHolder.length; i++){
              if($scope.contextPacksHolder[i]._id == $scope.currentContextPack._id){
                $scope.addWordPackToContextPack($scope.contextPacksHolder[i], newWordPack);
              }
            }
            $scope.createWordPackForContext = false;
          }
          $scope.createWordPackNameField = "";
          $scope.viewCreateWordPack = false;
        });
      } else {
        alert("Please enter a name for this word pack");
      }
    };

    $scope.viewAddWordPack = false;

    $scope.addWordPack = function(contextPack){
      $scope.viewAddWordPack = true;
      $scope.currentContextPack = contextPack;
    };

    $scope.addWordPackToContextPack = function(contextPack, newWordPack){
      $http.put('/api/contextPacks/' + contextPack._id + '/addWordPackToContextPack', {
        wordPackID: newWordPack._id
      }).success(function(){
        $scope.currentContextPack = null;
        for(var i = 0; i < $scope.contextPacksHolder.length; i++){
          if($scope.contextPacksHolder[i]._id == contextPack._id){
            $scope.contextPacksHolder[i].wordPacks.push({
              "_id":newWordPack._id,
              "name":newWordPack.name,
              "inContext": true
            });
          }
        }
      })
    };

    $scope.currentWordPack = null;
    $scope.viewWordsInWordPack = function(wordPack){
      $scope.viewEditContextName = false;
      $scope.viewEditWordPackName = false;
      $scope.viewWordPackWords = true;
      $scope.viewCreateWordPack = false;
      $scope.createWordPackForContext = false;
      $scope.currentWordPack = wordPack;
      $scope.wordsInWordPack = [];
      for(var index = 0; index < $scope.wordPacksArray.length; index++){
        if($scope.wordPacksArray[index]._id == wordPack._id){
          $scope.wordsInWordPack = $scope.getWordsFromWordIDs($scope.wordPacksArray[index].words);
        }
      }
    };
  });
