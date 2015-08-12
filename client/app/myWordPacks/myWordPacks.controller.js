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

    $scope.getWords = function(){
      $http.get('/api/words').success(function(words) {
        $scope.wordsArray = [];
        for(var index = 0; index < words.length; index++){
          if(words[index].userCreated == false){
            if($scope.wordsArray.indexOf(words[index]) == -1){
              $scope.wordsArray.push(words[index]);
            }
          } else if($scope.currentUser.words.indexOf(words[index]._id) != -1){
            if($scope.wordsArray.indexOf(words[index]) == -1){
              $scope.wordsArray.push(words[index]);
            }
          }
        }
        //console.log("Got words!")
      });
    };
    $scope.getWords();

    $scope.wordPacksNonContextHolder = [];  //Array organized to act as desired object
    $scope.wordPacksArray = [];  //Array of server objects

    $scope.getWordPacks = function(){
      $scope.wordPacksArray = [];
      $http.get('/api/wordPacks').success(function(wordPacks){
        var holder = wordPacks;
        for(var index = 0; index < holder.length; index++){
          if(holder[index].creatorID == $scope.currentUser._id){
            if($scope.wordPacksArray.indexOf(holder[index]) == -1){
              $scope.wordPacksArray.push(holder[index]);
            }
          }
        }
        //console.log("Got word packs!")
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

    $scope.contextPacksArray = [];
    $scope.wordPacksInContextIDs = [];
    $scope.getContextPacks = function(){
      $scope.contextPacksArray = [];
      $scope.wordPacksInContextIDs = [];
      $http.get('/api/contextPacks').success(function(contextPacks){
        for(var index = 0; index < contextPacks.length; index++){
          if(contextPacks[index].creatorID == $scope.currentUser._id){
            if($scope.contextPacksArray.indexOf(contextPacks[index]) == -1){
              $scope.contextPacksArray.push(contextPacks[index]);
              for(var i = 0; i < contextPacks[index].wordPacks.length; i++){
                if($scope.wordPacksInContextIDs.indexOf(contextPacks[index].wordPacks[i]) == -1){
                  $scope.wordPacksInContextIDs.push(contextPacks[index].wordPacks[i]);
                }
              }
            }
          }
        }
        $scope.getNonContextWordPacks();
        //console.log("Got context packs!")
      });
    };

    $scope.getWordPacksFromWordPackIDs = function(wordPackIDs){
      var toReturn = [];
      for(var index = 0; index < $scope.wordPacksArray.length; index++) {
        for(var index2 = 0; index2 < wordPackIDs.length; index2++) {
          if($scope.wordPacksArray[index]._id == wordPackIDs[index2] && toReturn.indexOf($scope.wordPacksArray[index]) == -1){
            toReturn.push($scope.wordPacksArray[index]);
            break;
          }
        }
      }
      return toReturn;
    };

    $scope.getNonContextWordPacks = function(){
      $scope.wordPacksNonContextHolder = [];
      for(var i = 0; i < $scope.wordPacksArray.length; i++){
        if($scope.wordPacksInContextIDs.indexOf($scope.wordPacksArray[i]._id) == -1 && $scope.wordPacksNonContextHolder.indexOf($scope.wordPacksArray[i]) == -1){
          $scope.wordPacksNonContextHolder.push($scope.wordPacksArray[i]);
        }
      }
      //console.log("Got non context word packs!")
    };

    $scope.getContextPacks();

    $scope.typeOptions =
      [
        "Adjective",
        "Adverb",
        "Article",
        "Conjunction",
        "Interjection",
        "Noun",
        "Preposition",
        "Pronoun",
        "Verb"
      ];

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
        $scope.viewAddWordPack = false;
        $scope.createWordPackForContext = false;
        $scope.viewAddWordsToWordPacks = false;
      } else if(view == 'all'){
        $scope.viewMyContextPacks = false;
        $scope.viewAllOfMyWordPacks = true;
        $scope.viewMyNonContextWordPacks = false;
        $scope.viewWordPackWords = false;
        $scope.viewEditWordPackName = false;
        $scope.viewCreateWordPack = false;
        $scope.viewAddWordPack = false;
        $scope.createWordPackForContext = false;
        $scope.viewAddWordsToWordPacks = false;
      } else if(view == 'indiv'){
        $scope.viewMyContextPacks = false;
        $scope.viewAllOfMyWordPacks = false;
        $scope.viewMyNonContextWordPacks = true;
        $scope.viewWordPackWords = false;
        $scope.viewEditWordPackName = false;
        $scope.viewCreateWordPack = false;
        $scope.viewAddWordPack = false;
        $scope.createWordPackForContext = false;
        $scope.viewAddWordsToWordPacks = false;
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
      $scope.viewAddWordPack = false;
      $scope.createWordPackForContext = false;
      $scope.viewAddWordsToWordPacks = false;
    };

    $scope.getWordPacksForContextPack = function (contextPack) {
      return $scope.getWordPacksFromWordPackIDs(contextPack.wordPacks);
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

    $scope.removeContextPack = function(contextPack){
      var contextHolder = contextPack;
      if(confirm("This will remove the Context Pack, but the Word Packs will still exist unless removed.")){
        $http.delete('/api/contextPacks/' + contextPack._id).success(function(){
          for(var i = 0; i < $scope.contextPacksArray.length; i++){
            if(contextHolder._id == $scope.contextPacksArray[i]._id){
              $scope.contextPacksArray.splice(i, 1);
            }
          }
        })
      }
    };

    $scope.viewCreateContextPack = false;

    $scope.newContextPack = function(){
      $scope.viewCreateContextPack = true;
      $scope.viewWordPackWords = false;
      $scope.viewEditWordPackName = false;
      $scope.viewCreateWordPack = false;
      $scope.viewAddWordPack = false;
      $scope.viewAddWordsToWordPacks = false;
    };

    $scope.createContextPack = function () {
      var holder = $scope.createContextPackNameField;
      if (holder.length > 0) {
        $http.post('/api/contextPacks/', {
          name: $scope.createContextPackNameField,
          creatorID: $scope.currentUser._id
        }).success(function(newContextPack){
          $scope.contextPacksArray.push(newContextPack);

          $scope.createContextPackNameField = "";
          $scope.viewCreateContextPack = false;
        });
      } else {
        alert("Please enter a name for this context pack");
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
      $scope.viewCreateContextPack = false;
      $scope.viewAddWordPack = false;
      $scope.createWordPackForContext = false;
      $scope.viewAddWordsToWordPacks = false;
    };

    $scope.updateWordPackName = function () {
      if ($scope.editWordPackName.length > 0) {
        $http.put('/api/wordPacks/' + $scope.wordPackToEdit._id + '/editWordPackName', {
          wordPackID: $scope.wordPackToEdit._id,
          name: $scope.editWordPackNameField
        }).success(function(){
          for(var k = 0; k < $scope.wordPacksArray.length; k++){
            if($scope.wordPacksArray[k]._id == $scope.wordPackToEdit._id){
              $scope.wordPacksArray[k].name = $scope.editWordPackNameField;
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
      $scope.viewWordPackWords = false;
      $scope.viewEditWordPackName = false;
      $scope.viewCreateWordPack = true;
      $scope.viewCreateContextPack = false;
      $scope.viewAddWordPack = false;
      $scope.viewAddWordsToWordPacks = false;
      if(item != null){
        $scope.currentContextPack = item;
        $scope.createWordPackForContext = true;
      }
    };

    $scope.createWordPack = function () {
      if ($scope.createWordPackNameField.length > 0) {
        $http.post('/api/wordPacks/', {
          name: $scope.createWordPackNameField,
          creatorID: $scope.currentUser._id
        }).success(function(newWordPack){
          var holder = newWordPack;
          holder.inContext = false;
          $scope.wordPacksArray.push(holder);
          $scope.wordPacksNonContextHolder.push(holder);
          if($scope.createWordPackForContext){
            for(var i = 0; i < $scope.contextPacksArray.length; i++){
              if($scope.contextPacksArray[i]._id == $scope.currentContextPack._id){
                $scope.addWordPackToContextPack($scope.contextPacksArray[i]._id, holder);
              }
            }
            $scope.createWordPackForContext = false;
          }
          $scope.createWordPackNameField = "";
          $scope.viewCreateWordPack = false;
          $scope.currentWordPack = holder;
          $scope.viewWordPackWords = true;
        });
      } else {
        alert("Please enter a name for this word pack");
      }
    };

    $scope.viewAddWordPackOptions = false;

    $scope.addWordPackOptions = function (item) {
      $scope.viewAddWordPackOptions = true;
      if(item == 'context'){

      } else if(item == 'all'){

      } else if(item == 'indiv'){

      } else if(item == 'off'){
        $scope.viewAddWordPackOptions = false;
      }
    };

    $scope.viewAddWordPack = false;

    $scope.addWordPack = function(contextPack){
      $scope.currentContextPack = contextPack;
      $scope.viewWordPackWords = false;
      $scope.viewEditWordPackName = false;
      $scope.viewAddWordPack = true;
      $scope.viewCreateWordPack = false;
      $scope.viewCreateContextPack = false;
      $scope.viewAddWordsToWordPacks = false;
    };

    $scope.addWordPackToContextPack = function(contextID, newWordPack){
      $http.put('/api/contextPacks/' + contextID + '/addWordPackToContextPack', {
        wordPackID: newWordPack._id
      }).success(function(){
        $scope.getContextPacks();
      })
    };

    $scope.removeWordPackFromContextPack = function(contextPack, oldWordPack){
      $http.put('/api/contextPacks/' + contextPack._id + '/removeWordPackFromContextPack', {
        wordPackID: oldWordPack._id
      }).success(function(){
        for(var i = 0; i < $scope.contextPacksArray.length; i++){
          if($scope.contextPacksArray[i]._id == contextPack._id){
            for(var j = 0; j < $scope.contextPacksArray[i].wordPacks.length; j++){
              if($scope.contextPacksArray[i].wordPacks[j] == oldWordPack._id){
                $scope.contextPacksArray[i].wordPacks.splice(j, 1);
              }
            }
          }
        }
        for(var k = 0; k < $scope.wordPacksArray.length; k++){
          if($scope.wordPacksArray[k]._id == oldWordPack._id){
            $scope.wordPacksArray[k].inContext = false;
          }
        }
        $scope.wordPacksNonContextHolder.push(oldWordPack);
      })
    };

    $scope.currentWordPack = null;
    $scope.wordsNotInWordPack = [];

    $scope.viewWordsInWordPack = function(wordPack){
      $scope.viewEditContextName = false;
      $scope.viewEditWordPackName = false;
      $scope.viewWordPackWords = true;
      $scope.viewCreateWordPack = false;
      $scope.viewCreateContextPack = false;
      $scope.createWordPackForContext = false;
      $scope.viewAddWordsToWordPacks = false;
      $scope.currentWordPack = wordPack;
      $scope.wordsInWordPack = [];
      $scope.wordsNotInWordPack = [];
      var wordsInWordPackIDs = [];
      for(var index = 0; index < $scope.wordPacksArray.length; index++){
        if($scope.wordPacksArray[index]._id == wordPack._id){
          wordsInWordPackIDs = $scope.wordPacksArray[index].words;
          $scope.wordsInWordPack = $scope.getWordsFromWordIDs($scope.wordPacksArray[index].words);
        }
      }
      for(var index2 = 0; index2 < $scope.wordsArray.length; index2++){
        if(wordsInWordPackIDs.indexOf($scope.wordsArray[index2]._id) == -1){
          $scope.wordsNotInWordPack.push({
            "_id":$scope.wordsArray[index2]._id,
            "name":$scope.wordsArray[index2].name,
            "wordType":$scope.wordsArray[index2].wordType
          });
        }
      }
    };

    $scope.viewAddWordsToWordPacks = false;

    $scope.addWords = function(){
      $scope.viewAddWordsToWordPacks = true;
    };

    $scope.addWordsToWordPack = function(word){
      var newWord = word;
        $http.put('/api/wordPacks/' + $scope.currentWordPack._id + '/addWordToWordPack', {
          wordID: word._id
        }).success(function () {
          $scope.wordsInWordPack.push({
            "_id": newWord._id,
            "name": newWord.name,
            "wordType": newWord.wordType
          });
          for (var index = 0; index < $scope.wordsNotInWordPack.length; index++) {
            if ($scope.wordsNotInWordPack[index]._id == newWord._id) {
              $scope.wordsNotInWordPack.splice(index, 1);
            }
          }
          $scope.getWordPacks();
        })
    };

    $scope.removeWordFromWordPack = function(word){
      var oldWord = word;
        $http.put('/api/wordPacks/' + $scope.currentWordPack._id +'/removeWordIDFromWordPack', {
            wordID: word._id
        }).success(function(){
          for(var index = 0; index < $scope.wordsInWordPack.length; index++){
            if($scope.wordsInWordPack[index]._id == oldWord._id){
              $scope.wordsInWordPack.splice(index, 1);
            }
          }
          $scope.wordsNotInWordPack.push({
            "_id":oldWord._id,
            "name":oldWord.name,
            "wordType":oldWord.wordType
          });
          $scope.getWordPacks();
        })
    };

    $scope.removeWordPack = function(wordPack){
      var wordPackHolder = wordPack;
      if(confirm("Are you sure you want to delete "+wordPack.name+"? "+'\n\n'+"*Note*"+'\n'+" This will not delete words in the word pack")){
        $http.delete('/api/wordPacks/' + wordPack._id).success(function(){
          for(var i = 0; i < $scope.wordPacksNonContextHolder.length; i++){
            if(wordPackHolder._id == $scope.wordPacksNonContextHolder[i]._id){
              $scope.wordPacksNonContextHolder.splice(i, 1);
            }
          }
          for(var j = 0; j < $scope.wordPacksArray.length; j++){
            if(wordPackHolder._id == $scope.wordPacksArray[j]._id){
              $scope.wordPacksArray.splice(j, 1);
            }
          }
        })
      }
    };

  });
