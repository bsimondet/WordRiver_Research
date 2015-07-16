'use strict';

angular.module('WordRiverApp')
  .controller('MyClassesCtrl', function ($scope, $location, $http, Auth) {
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

    //Helper to check for duplicates and remove them
    $scope.checkForDuplicates = function(array){
      for (var i = 0; i < array.length; i++) {
        for (var j = i + 1; j < array.length; j++) {
          if (array[i]==array[j]){
            array.splice(j,1);
          }
        }
      }
      return array;
    };

    $scope.classArray = [];
    $scope.userStudents = [];
    $scope.wordsArray = [];
    $scope.wordsHolder = [];

    $scope.getClasses = function(){
      $http.get("/api/users/me").success(function(user){
        $scope.classArray = [];
        $scope.classArray = user.classList;
      });
      $scope.classArray = $scope.checkForDuplicates($scope.classArray);
    };

    $scope.getStudents = function(){
      $scope.userStudents = [];
      $http.get("/api/students").success(function(allStudents) {
        for(var i = 0; i < allStudents.length; i++) {
          if ($scope.inArray(allStudents[i].teachers, $scope.currentUser._id)) {
            $scope.userStudents.push(allStudents[i]);
          }
        }
      });
      $scope.userStudents = $scope.checkForDuplicates($scope.userStudents);
    };

    $scope.getWords = function(){
      $scope.wordsArray = [];
      $scope.wordsHolder = [];
      $scope.wordsHolderIDs = [];
      $http.get('/api/tile').success(function(words) {
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

    $scope.getWordsStudentsClasses = function(){
      $scope.getClasses();
      $scope.getStudents();
      $scope.getWords();
    };
    $scope.getWordsStudentsClasses();

    $scope.wordPacksHolder = [];
    $scope.wordPacksArray = [];

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
                "words": $scope.getWordsFromWordIDs(wordPacks[index].wordsInWordPack),
                "inContext": false
              });

            }
          }
        }
      });
    };

    $scope.getWordsFromWordIDs = function(wordIDs){
      var toReturn = [];
      for(var index = 0; index < $scope.wordsHolder.length; index++) {
        for(var index2 = 0; index2 < wordIDs.length; index2++) {
          if($scope.wordsHolder[index]._id == wordIDs[index2] && toReturn.indexOf($scope.wordsHolder[index]) == -1){
            toReturn.push($scope.wordsHolder[index]);
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
      $http.get('/api/contextPacks/').success(function(contextPacks){
        for(var index = 0; index < contextPacks.length; index++){
          if(contextPacks[index].creatorID == $scope.currentUser._id){
            if($scope.contextPacksArray.indexOf(contextPacks[index]) == -1){
              $scope.contextPacksArray.push(contextPacks[index]);
            }
            $scope.contextPacksHolder.push({
              "_id": contextPacks[index]._id,
              "name": contextPacks[index].name,
              "words": $scope.getWordsFromWordIDs(contextPacks[index].wordsInContextPack),
              "wordPacks": $scope.getWordPacksFromWordPackIDs(contextPacks[index].wordPacksInContextPack)
          });
          }
        }
        $scope.contextPacksHolder = $scope.checkForDuplicates($scope.contextPacksHolder);
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

    //For class/group/context views
    $scope.viewClassInfo = true;
    $scope.viewGroupInfo = false;

    $scope.headerTitle = "My Classes"; //For changing the header banner
    $scope.isGroupsCollapsed = false; //For collapsing groups
    $scope.wpIsCollapsed = false; //For collapsing word packs in context view

    //For group views
    $scope.viewStudents = false;
    $scope.viewContextPacks = false;
    $scope.viewIndivWordPacks = false;
    $scope.viewAllWordPacks = false;

    //For editing the class name
    $scope.hideEdit = true;
    $scope.classToEdit = null;
    $scope.editField = "";

    //For editing the group name
    $scope.hideGroupEdit = true;
    $scope.groupEditField = "";

    //For viewing contextPacks
    $scope.currentContextPack = null;

    //For viewing groups
    $scope.currentGroup = null;
    //For viewing current class of current group
    $scope.currentGroupClass = null;
    //For viewing class information
    $scope.studentsInClass = [];
    //For viewing group information
    $scope.studentsInGroup = [];
    $scope.allWordsInGroup= [];
    $scope.indivWordsInGroup = [];
    $scope.wordPackWordsInGroup = [];
    $scope.wordIDsInGroup = [];
    $scope.allWordPacksInGroup = [];
    $scope.indivWordPacksInGroup = [];
    $scope.wordPackIDsInGroup = [];
    $scope.contextPacksInGroup = [];
    $scope.wordsInWordPack = [];
    $scope.currentWordPack = null;
    $scope.viewWordPackWords = false;

    $scope.viewAllWords = false;
    $scope.viewIndivWords = false;

    $scope.showWordPackSort = false;
    $scope.showWordSort = false;

    //Toggles between classes and groups
    $scope.toggleClassGroup = function(view) {
      if(view == 'class'){
        $scope.headerTitle = "My Classes";
        $scope.viewClassInfo = true;
        $scope.viewGroupInfo = false;
        $scope.viewStudents = false;
        $scope.viewGroupItems('off');
      } else if (view == 'group') {
        $scope.headerTitle = $scope.currentGroup.groupName;
        $scope.viewClassInfo = false;
        $scope.viewGroupInfo = true;
        $scope.viewStudents = true;
      }
    };

    $scope.viewGroupItems = function(item) {
      if(item == 'wordPacks'){
        $scope.showWordPackSort = true;
        $scope.showWordSort = false;
        $scope.wordFilter('off');
        $scope.wordPackFilter('contextPacks');
      } else if (item == 'words'){
        $scope.showWordPackSort = false;
        $scope.showWordSort = true;
        $scope.wordFilter('all');
        $scope.wordPackFilter('off');
      } else if (item == 'off') {
        $scope.showWordPackSort = false;
        $scope.showWordSort = false;
        $scope.wordFilter('off');
        $scope.wordPackFilter('off');
      }
    };

    $scope.toggleWPinCP = function (option){
      if(option == 'close'){
        $scope.wpIsCollapsed = true;
      } else if (option == 'open'){
        $scope.wpIsCollapsed = false;
      }
    };

    $scope.wordPackFilter = function(item) {
      if(item == 'contextPacks'){
        $scope.viewContextPacks = true;
        $scope.viewIndivWordPacks = false;
        $scope.viewAllWordPacks = false;
        $scope.viewWordPackWords = false;
        $scope.toggleWPinCP('open');
      } else if (item == 'individual'){
        $scope.viewContextPacks = false;
        $scope.viewIndivWordPacks = true;
        $scope.viewAllWordPacks = false;
        $scope.viewWordPackWords = false;
        $scope.toggleWPinCP('open');
      } else if (item == 'all') {
        $scope.viewContextPacks = false;
        $scope.viewIndivWordPacks = false;
        $scope.viewAllWordPacks = true;
        $scope.viewWordPackWords = false;
        $scope.toggleWPinCP('open');
      } else if (item == 'off') {
        $scope.viewContextPacks = false;
        $scope.viewIndivWordPacks = false;
        $scope.viewAllWordPacks = false;
        $scope.viewWordPackWords = false;
        $scope.toggleWPinCP('open');
      }
    };

    $scope.wordFilter = function(item) {
      if(item == 'individual'){
        $scope.viewAllWords = false;
        $scope.viewIndivWords = true;
        $scope.viewWordPackWords = false;
      } else if (item == 'all') {
        $scope.viewAllWords = true;
        $scope.viewIndivWords = false;
        $scope.viewWordPackWords = false;
      } else if (item == 'off') {
        $scope.viewAllWords = false;
        $scope.viewIndivWords = false;
        $scope.viewWordPackWords = false;
        $scope.wpIsCollapsed = false;
      }
    };


    $scope.findIndexOfClass = function (myclass) {
      for (var i = 0; i < $scope.classArray.length; i++) {
        if (myclass._id == $scope.classArray[i]._id) {
          return i;
        }
      }
    };

    $scope.findIndexOfGroup = function (group) {
      var editClassIndex = $scope.findIndexOfClass($scope.currentGroupClass);
      for (var i = 0; i < $scope.classArray[editClassIndex].groupList.length; i++) {
        if (group._id == $scope.classArray[editClassIndex].groupList[i]._id) {
          return i;
        }
      }
    };

    $scope.editClassName = function (myclass) {
      $scope.editClassIndex = $scope.findIndexOfClass(myclass);
      $scope.hideEdit = false;
      $scope.classToEdit = $scope.classArray[$scope.findIndexOfClass(myclass)];
    };

    //Updates a word in the server when it's edited
    $scope.updateClass = function () {
      //If a word is entered, but the type is not
      if ($scope.editField.length > 0) {
        $http.put('/api/users/' + $scope.currentUser._id + '/class', {
          classID: $scope.classToEdit._id,
          className: $scope.editField
        }).success(function(){
          $scope.editField = "";
          $scope.getClasses();
          $scope.hideEdit = true;
        });
      } else {
        alert("Please enter a new name for this class");
      }
    };

    //Deletes a word from the server and from a user's array of words they've created
    $scope.removeClass = function (myclass) {
      $scope.classToRemove = $scope.classArray[$scope.findIndexOfClass(myclass)];
      $http.put('/api/users/' + $scope.currentUser._id + '/deleteClass',
        {myClassID: $scope.classToRemove._id}
      ).success(function () {
          $scope.getClasses();
          $scope.removeClassIDFromStudents($scope.classToRemove._id);
        });
    };

    $scope.removeClassIDFromStudents = function (toRemoveID) {
      for(var index = 0; index < $scope.userStudents.length; index++) {
        for(var index2 = 0; index2 < $scope.userStudents[index].classList.length; index2++) {
          if ($scope.userStudents[index].classList[index2]._id == toRemoveID) {
            $http.put('/api/students/' + $scope.userStudents[index]._id + '/removeClass',
              {_id:$scope.userStudents[index]._id,
                classID: toRemoveID}
            ).success(function () {
              });
          }
        }
      }
    };

    $scope.editGroupName = function (group) {
      $scope.editClassIndex = $scope.findIndexOfClass($scope.currentGroupClass);
      $scope.editGroupIndex = $scope.findIndexOfGroup(group);
      $scope.hideGroupEdit = false;
      $scope.groupToEdit = $scope.classArray[$scope.editClassIndex].groupList[$scope.editGroupIndex];
    };

    //Updates a word in the server when it's edited
    $scope.updateGroup = function () {
      if ($scope.groupEditField.length > 0) {
        $http.put('/api/users/' + $scope.currentUser._id + '/group', {
          groupID: $scope.groupToEdit._id,
          groupName: $scope.groupEditField
        }).success(function(){
          $scope.currentGroup.groupName = $scope.groupEditField;
          $scope.groupEditField = "";
          $scope.getClasses();
          $scope.hideGroupEdit = true;
        });
      } else {
        alert("Please enter a new name for this group");
      }
    };

    //Deletes a word from the server and from a user's array of words they've created
    $scope.removeGroup = function (group) {
      $scope.editClassIndex = $scope.findIndexOfClass($scope.currentGroupClass);
      $scope.editGroupIndex = $scope.findIndexOfGroup(group);
      $scope.groupToRemove = $scope.classArray[$scope.editClassIndex].groupList[$scope.editGroupIndex];
      $http.put('/api/users/' + $scope.currentUser._id + '/deleteGroup',
        {groupID: $scope.groupToRemove._id}
      ).success(function () {
          $scope.getClasses();
          $scope.removeGroupIDFromStudents($scope.groupToRemove._id);
          $scope.toggleClassGroup('class');
        });
    };

    $scope.removeGroupIDFromStudents = function (toRemoveID) {
      for(var index = 0; index < $scope.userStudents.length; index++) {
        for(var index2 = 0; index2 < $scope.userStudents[index].classList.length; index2++) {
          for(var index3 = 0; index3 < $scope.userStudents[index].classList[index2].groupList.length; index3++) {
            if ($scope.userStudents[index].classList[index2].groupList[index3] == toRemoveID) {
              $http.put('/api/students/' + $scope.userStudents[index]._id + '/removeGroup',
                {_id: $scope.userStudents[index]._id,
                  groupID: toRemoveID}
              ).success(function () {
                });
            }
          }
        }
      }
    };

    $scope.viewGroups = function(group, myClass){
      $scope.currentGroup = group;
      $scope.currentGroupClass = myClass;
      $scope.toggleClassGroup('group');
      $scope.studentsInGroup = [];
      $scope.allWordPacksInGroup = [];
      $scope.indivWordPacksInGroup = [];
      $scope.allWordsInGroup = [];
      $scope.indivWordsInGroup = [];
      $scope.wordPackWordsInGroup = [];
      $scope.contextPacksHolderGroup = [];
      $scope.getStudentsInGroup($scope.currentGroup, $scope.studentsInGroup);
      $scope.getIDsInGroup($scope.currentGroup);
      $scope.getGroupArray($scope.wordIDsInGroup, $scope.wordsHolder, $scope.indivWordsInGroup);
      $scope.getGroupArray($scope.wordPackIDsInGroup, $scope.wordPacksHolder, $scope.allWordPacksInGroup);
      $scope.getIndivWordPacksInGroup($scope.allWordPacksInGroup, $scope.indivWordPacksInGroup);
      $scope.getAllWordsInGroup($scope.indivWordsInGroup, $scope.allWordPacksInGroup, $scope.allWordsInGroup);
      $scope.contextPacksHolderGroup = $scope.getContextPacksInGroup();
    };

    //Filters to get context packs with word packs assigned to groups
    $scope.getContextPacksInGroup = function() {
      var toReturn = [];
      var toReturnIDs = [];
      for(var index = 0; index < $scope.contextPacksHolder.length; index++){
        for(var index2 = 0; index2 < $scope.allWordPacksInGroup.length; index2++){
          if($scope.contextPacksHolder[index].wordPacks.indexOf($scope.allWordPacksInGroup[index2]) != -1){
            for(var i = 0; i < toReturn.length; i++) {
              toReturnIDs.push(toReturn[i]._id);
            }
            if(toReturnIDs.indexOf($scope.contextPacksHolder[index]._id) == -1){
              var holdAssignedArr = $scope.getAssignedWordPacks($scope.contextPacksHolder[index].wordPacks);
              console.log($scope.contextPacksHolder[index].words);
              toReturn.push({
                "name": $scope.contextPacksHolder[index].name,
                "_id": $scope.contextPacksHolder[index]._id,
                "words": $scope.contextPacksHolder[index].words,
                "assignedWordPacks": holdAssignedArr,
                "notAssignedWordPacks": $scope.getNotAssignedWordPacks(holdAssignedArr, $scope.contextPacksHolder[index].wordPacks)
              });
            }
          }
        }
      }
      return toReturn;
    };

    $scope.getAssignedWordPacks = function (wordPacks){
      var toReturn = [];
      for(var index = 0; index < $scope.allWordPacksInGroup.length; index++){
        for(var index2 = 0; index2 < wordPacks.length; index2++){
          if($scope.allWordPacksInGroup[index] == wordPacks[index2] && toReturn.indexOf($scope.allWordPacksInGroup[index]) == -1){
            toReturn.push($scope.allWordPacksInGroup[index])
          }
        }
      }
      return toReturn;
    };

    $scope.getNotAssignedWordPacks = function (assignedWordPacks, allWordPacksInContextPack){
      var toReturn = [];
      for(var index = 0; index < allWordPacksInContextPack.length; index++){
        if(assignedWordPacks.indexOf(allWordPacksInContextPack[index]) == -1 && toReturn.indexOf(allWordPacksInContextPack[index]) == -1){
          toReturn.push(allWordPacksInContextPack[index]);
        }
      }
      return toReturn;
    };

    $scope.getAllWordsInGroup = function(indivWordsInGroup, allWordPacksInGroup, toReturn){
      for(var index = 0; index < allWordPacksInGroup.length; index++){
        for(var index2 = 0; index2 < allWordPacksInGroup[index].words.length; index2++){
          if(toReturn.indexOf(allWordPacksInGroup[index].words[index2]) == -1){
            toReturn.push(allWordPacksInGroup[index].words[index2]);
          }
        }
      }
    };

    $scope.getIndivWordPacksInGroup = function(allWordPacksInGroup, toReturn){
      for(var index = 0; index < allWordPacksInGroup.length; index++) {
        if(allWordPacksInGroup[index].inContext == false && toReturn.indexOf(allWordPacksInGroup[index]) == -1){
          toReturn.push(allWordPacksInGroup[index]);
        }
      }
    };

    $scope.getWordPackWordsAssignedToGroup = function (){
      var toReturn = [];
      for(var index = 0; index < $scope.allWordPacksInGroup.length; index++) {
        for(var index2 = 0; index2 < $scope.allWordPacksInGroup[index].words.length; index2++) {
          if(toReturn.indexOf($scope.allWordPacksInGroup[index].words[index2]) == -1) {
            toReturn.push($scope.allWordPacksInGroup[index].words[index2]);
          }
        }
      }
      toReturn = $scope.checkForDuplicates(toReturn);
      return toReturn;
    };

    $scope.getGroupArray = function(idArr, completeArr, returnArr){
      for(var index = 0; index < completeArr.length; index++) {
        for (var index2 = 0; index2 < idArr.length; index2++) {
          if(completeArr[index]._id == idArr[index2]) {
            returnArr.push(completeArr[index]);
          }
        }
      }
    };

    $scope.getIDsInGroup = function(group) {
      $scope.wordPackIDsInGroup = [];
      $scope.wordIDsInGroup = [];
      for (var index = 0; index < $scope.classArray.length; index++) {
        for (var index2 = 0; index2 < $scope.classArray[index].groupList.length; index2++) {
          if ($scope.classArray[index].groupList[index2]._id == group._id) {
            $scope.wordPackIDsInGroup = $scope.classArray[index].groupList[index2].wordPacks;
            $scope.wordIDsInGroup = $scope.classArray[index].groupList[index2].words;
          }
        }
      }
    };

    $scope.getStudentsInGroup = function(group, toReturn){
      for(var index = 0; index < $scope.userStudents.length; index++){
        for(var index2 = 0; index2 < $scope.userStudents[index].classList.length; index2++){
          for(var index3 = 0; index3 < $scope.userStudents[index].classList[index2].groupList.length; index3++) {
            if ($scope.userStudents[index].classList[index2].groupList[index3] == group._id && toReturn.indexOf($scope.userStudents[index]) == -1) {
              toReturn.push($scope.userStudents[index]);
            }
          }
        }
      }
    };

    $scope.viewWordsInWordPack = function(wordPack){
      $scope.viewWordPackWords = true;
      $scope.currentWordPack = wordPack;
      console.log(wordPack._id)
      $scope.wordsInWordPack = [];
      for(var index = 0; index < $scope.wordPacksHolder.length; index++){
        if($scope.wordPacksHolder[index]._id == wordPack._id){
          $scope.wordsInWordPack = wordPack.words;
        }
      }
    };

  });
