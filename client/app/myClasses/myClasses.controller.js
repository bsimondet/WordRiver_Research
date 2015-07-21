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

    $scope.classArray = [];
    $scope.userStudents = [];
    $scope.wordsArray = [];
    $scope.wordsHolder = [];

    $scope.getClasses = function(){
      $http.get("/api/users/me").success(function(user){
        $scope.classArray = [];
        $scope.classArray = user.classList;
      });
    };

    $scope.getStudents = function(){
      $scope.userStudents = [];
      $http.get("/api/students").success(function(allStudents) {
        for(var i = 0; i < allStudents.length; i++) {
          if ($scope.inArray(allStudents[i].teachers, $scope.currentUser._id) && $scope.userStudents.indexOf(allStudents[i]) == -1) {
            $scope.userStudents.push(allStudents[i]);
          }
        }
      });
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
    $scope.contextPacksHolderNotGroup = [];
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

    $scope.isGroupsCollapsed = false; //For collapsing groups

    //For editing the class name
    $scope.hideEdit = true;
    $scope.classToEdit = null;
    $scope.editField = "";

    //For editing group names
    $scope.hideGroupEdit = true;
    $scope.groupEditField = "";

    //For viewing current class of current group
    $scope.currentGroupClass = null;
    //For viewing class information
    $scope.studentsInClass = [];

/*
    For viewing group information
*/
    $scope.currentContextPack = null;  //For getting current context pack related information
    $scope.currentGroup = null;  //For getting current group related content
    $scope.studentsInGroup = [];  //For getting students assigned to a group
    $scope.studentsNotInGroup = [];  //For getting students not assigned to a group
    $scope.wordIDsInGroup = [];  //For getting words assigned to a group
    $scope.wordPackIDsInGroup = [];  //For getting word packs assigned to a group
    $scope.allWordsInGroup= [];  //For getting ALL words assigned to a group
    $scope.indivWordsInGroup = [];  //For getting individually assigned words to a group
    $scope.wordsNotInGroup= [];  //For getting ALL words not assigned to a group
    $scope.allWordPacksInGroup = [];  //For getting ALL word packs assigned to a group
    $scope.allWordPacksNotInGroup = [];  //For getting ALL word packs not assigned to a group
    $scope.indivWordPacksInGroup = [];  //For getting individually assigned word packs to a group
    $scope.indivWordPacksNotInGroup = [];  //For getting individually word packs not assigned to a group

    $scope.wordsInWordPack = [];  //For displaying words in a selected word pack
    $scope.currentWordPack = null;  //For displaying the name of a selected word pack

    //For class/group/context views
    $scope.headerTitle = "My Classes"; //For changing the header banner
    $scope.viewClassInfo = true;
    $scope.viewGroupInfo = false;
    $scope.viewStudents = false;
    $scope.wpIsCollapsed = false; //For collapsing word packs in context view

    //Toggles between classes and groups
    $scope.toggleClassGroup = function(view) {
      if(view == 'class'){
        $scope.headerTitle = "My Classes";
        $scope.viewClassInfo = true;
        $scope.viewGroupInfo = false;
        $scope.viewStudents = false;
        $scope.viewGroupItems('off');
        $scope.toggleStudentAddGroup('off');
        $scope.hideWordAddGroup('off');
        $scope.hideWordAddGroup();
      } else if (view == 'group') {
        $scope.headerTitle = $scope.currentGroup.groupName;
        $scope.viewClassInfo = false;
        $scope.viewGroupInfo = true;
        $scope.viewStudents = true;
      }
    };

    $scope.showWordPackSort = false;
    $scope.showWordSort = false;
    $scope.viewWordPackWords = false;

    $scope.viewGroupItems = function(item) {
      if(item == 'wordPacks'){
        $scope.showWordPackSort = true;
        $scope.showWordSort = false;
        $scope.wordFilter('off');
        $scope.wordPackFilter('contextPacks');
        $scope.toggleStudentAddGroup('off');
        $scope.hideWordAddGroup('off');
        $scope.toggleWordPackAddGroup('off');
      } else if (item == 'words'){
        $scope.showWordPackSort = false;
        $scope.showWordSort = true;
        $scope.wordFilter('all');
        $scope.wordPackFilter('off');
        $scope.toggleStudentAddGroup('off');
        $scope.hideWordAddGroup('off');
        $scope.toggleWordPackAddGroup('off');
      } else if (item == 'off') {
        $scope.showWordPackSort = false;
        $scope.showWordSort = false;
        $scope.wordFilter('off');
        $scope.wordPackFilter('off');
        $scope.toggleStudentAddGroup('off');
        $scope.hideWordAddGroup('off');
        $scope.toggleWordPackAddGroup('off');
      }
    };

    $scope.viewAddStudents = false;

    $scope.toggleStudentAddGroup = function (item){
      if(item == 'on'){
        $scope.viewAddStudents = true;
        $scope.showWordPackSort = false;
        $scope.showWordSort = false;
        $scope.wordFilter('off');
        $scope.wordPackFilter('off');
        $scope.hideWordAddGroup('off');
        $scope.toggleWordPackAddGroup('off');
      } else if (item == 'off') {
        $scope.viewAddStudents = false;
      }
    };

    $scope.viewContextPacks = false;
    $scope.viewIndivWordPacks = false;
    $scope.viewAllWordPacks = false;

    $scope.wordPackFilter = function(item) {
      if(item == 'contextPacks'){
        $scope.viewContextPacks = true;
        $scope.viewIndivWordPacks = false;
        $scope.viewAllWordPacks = false;
        $scope.viewWordPackWords = false;
        $scope.toggleWordPackAddGroup('off');
        $scope.toggleWPinCP('open');
      } else if (item == 'individual'){
        $scope.viewContextPacks = false;
        $scope.viewIndivWordPacks = true;
        $scope.viewAllWordPacks = false;
        $scope.viewWordPackWords = false;
        $scope.toggleWordPackAddGroup('off');
        $scope.toggleWPinCP('open');
      } else if (item == 'all') {
        $scope.viewContextPacks = false;
        $scope.viewIndivWordPacks = false;
        $scope.viewAllWordPacks = true;
        $scope.viewWordPackWords = false;
        $scope.toggleWordPackAddGroup('off');
        $scope.toggleWPinCP('open');
      } else if (item == 'off') {
        $scope.viewContextPacks = false;
        $scope.viewIndivWordPacks = false;
        $scope.viewAllWordPacks = false;
        $scope.viewWordPackWords = false;
        $scope.toggleWPinCP('open');
      }
    };

    $scope.viewAllWords = false;
    $scope.viewIndivWords = false;

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

    $scope.position = "Hide";

    $scope.toggleWPinCP = function (option){
      if(option == 'close'){
        $scope.position = "Show";
        $scope.wpIsCollapsed = true;
      } else if (option == 'open'){
        $scope.position = "Hide";
        $scope.wpIsCollapsed = false;
      }else if (option == 'toggle'){
        if($scope.wpIsCollapsed == true){
          $scope.position = "Hide";
        } else if($scope.wpIsCollapsed == false){
          $scope.position = "Show";
        }
        $scope.wpIsCollapsed = !$scope.wpIsCollapsed;

      }
    };


    $scope.viewAddWord = false;

    $scope.hideWordAddGroup = function (item){
      if(item == 'on'){
        $scope.viewAddWord = true;
        $scope.showWordPackSort = false;
        $scope.showWordSort = false;
        $scope.wordFilter('off');
        $scope.wordPackFilter('off');
        $scope.toggleStudentAddGroup('off');
        $scope.toggleWordPackAddGroup('off');
      } else if (item == 'off') {
        $scope.viewAddWord = false;
      }
    };

    $scope.viewAddWordPacks = false;
    $scope.viewAddAllWordPacks = false;
    $scope.viewAddIndivWordPacks = false;
    $scope.viewAddContextWordPacks = false;

    $scope.toggleWordPackAddGroup = function (item){
      if(item == 'all') {
        $scope.viewAddWordPacks = true;
        $scope.viewAddAllWordPacks = true;
        $scope.viewAddIndivWordPacks = false;
        $scope.viewAddContextWordPacks = false;
        $scope.viewWordPackWords = false;
      } else if (item == 'indiv'){
        $scope.viewAddWordPacks = true;
        $scope.viewAddAllWordPacks = false;
        $scope.viewAddIndivWordPacks = true;
        $scope.viewAddContextWordPacks = false;
        $scope.viewWordPackWords = false;
      } else if (item == 'context'){
        $scope.viewAddWordPacks = true;
        $scope.viewAddAllWordPacks = false;
        $scope.viewAddIndivWordPacks = false;
        $scope.viewAddContextWordPacks = true;
        $scope.viewWordPackWords = false;
      } else if (item == 'off') {
        $scope.viewAddWordPacks = false;
        $scope.viewAddAllWordPacks = false;
        $scope.viewAddIndivWordPacks = false;
        $scope.viewAddContextWordPacks = false;
      }
    };

    $scope.viewEditWordPacks = false;

    $scope.toggleWordPacksEditGroup = function (item){
      if(item == 'on'){
        $scope.viewEditWordPacks = true;
      } else if(item == 'off'){
        $scope.viewEditWordPacks = false;
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
      $scope.studentsNotInGroup = [];
      $scope.allWordPacksInGroup = [];
      $scope.allWordPacksNotInGroup = [];
      $scope.indivWordPacksInGroup = [];
      $scope.indivWordPacksNotInGroup = [];
      $scope.allWordsInGroup = [];
      $scope.allWordsNotInGroup = [];
      $scope.indivWordsInGroup = [];
      $scope.contextPacksHolderGroup = [];
      $scope.contextPacksHolderNotGroup = [];
      $scope.getStudentsInGroup($scope.currentGroup, $scope.studentsInGroup, $scope.studentsNotInGroup);
      $scope.getIDsInGroup($scope.currentGroup);
      $scope.getIndivWordsInGroup($scope.wordIDsInGroup, $scope.wordsHolder, $scope.indivWordsInGroup, $scope.allWordsInGroup);
      $scope.getAllWordPacksInGroup($scope.wordPackIDsInGroup, $scope.wordPacksHolder, $scope.allWordPacksInGroup, $scope.allWordsInGroup);
      $scope.getContextPacksInGroup($scope.contextPacksHolderGroup);
      $scope.getContextPacksNotInGroup($scope.contextPacksHolderGroup, $scope.contextPacksHolderNotGroup);
      //console.log($scope.contextPacksHolderNotGroup.length);
      $scope.getAllWordsNotInGroup($scope.allWordsInGroup, $scope.allWordsNotInGroup);
      $scope.getIndivWordPacksInGroup($scope.allWordPacksInGroup, $scope.indivWordPacksInGroup);
      $scope.getWordPacksNotInGroup($scope.allWordPacksInGroup, $scope.allWordPacksNotInGroup, 'all');
      $scope.getWordPacksNotInGroup($scope.indivWordPacksInGroup, $scope.indivWordPacksNotInGroup, 'not');
    };

    //Filters to get context packs with word packs assigned to groups
    $scope.getContextPacksInGroup = function(toReturn) {
      var toReturnIDs = [];
      for(var index = 0; index < $scope.contextPacksHolder.length; index++){
        for(var index2 = 0; index2 < $scope.allWordPacksInGroup.length; index2++){
          if($scope.contextPacksHolder[index].wordPacks.indexOf($scope.allWordPacksInGroup[index2]) != -1){
            for(var i = 0; i < toReturn.length; i++) {
              toReturnIDs.push(toReturn[i]._id);
            }
            if(toReturnIDs.indexOf($scope.contextPacksHolder[index]._id) == -1){
              toReturn.push({
                "name": $scope.contextPacksHolder[index].name,
                "_id": $scope.contextPacksHolder[index]._id,
                "wordPacks": $scope.contextPacksHolder[index].wordPacks
              });
            }
          }
        }
      }
    };

    $scope.getContextPacksNotInGroup = function(contextPacksHolderGroup, contextPacksHolderNotGroup){
      var contextPackIDs =[];
      contextPacksHolderNotGroup =[];
      for(var i = 0; i < contextPacksHolderGroup.length; i++){
        contextPackIDs.push(contextPacksHolderGroup[i]._id);
      }
      for(var index = 0; index < $scope.contextPacksArray.length; index++){
        if(contextPackIDs.indexOf($scope.contextPacksArray[index]._id) == -1 && contextPacksHolderNotGroup.indexOf($scope.contextPacksArray[index]) == -1){
          contextPacksHolderNotGroup.push({
            "name": $scope.contextPacksArray[index].name,
            "_id": $scope.contextPacksArray[index]._id,
            "wordPacks": $scope.getWordPacksFromWordPackIDs($scope.contextPacksArray[index].wordPacks)
        });
        }
      }
      //console.log("In func "+contextPacksHolderNotGroup.length);
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
      return toReturn;
    };

    $scope.getIndivWordsInGroup = function(wordIDsInGroup, wordsHolder, indivWordsInGroup, allWordsInGroup){
      for(var index = 0; index < wordsHolder.length; index++) {
        for (var index2 = 0; index2 < wordIDsInGroup.length; index2++) {
          if(wordsHolder[index]._id == wordIDsInGroup[index2] && indivWordsInGroup.indexOf(wordsHolder[index]) == -1) {
            indivWordsInGroup.push(wordsHolder[index]);
            if(allWordsInGroup.indexOf(wordsHolder[index]) == -1){
              allWordsInGroup.push(wordsHolder[index]);
            }
          }
        }
      }
    };

    $scope.getAllWordPacksInGroup = function(wordPackIDsInGroup, wordPacksHolder, allWordPacksInGroup, allWordsInGroup){
      var arrHold = [];
      for(var index = 0; index < wordPacksHolder.length; index++) {
        for (var index2 = 0; index2 < wordPackIDsInGroup.length; index2++) {
          if(wordPacksHolder[index]._id == wordPackIDsInGroup[index2] && allWordPacksInGroup.indexOf(wordPacksHolder[index]) == -1) {
            allWordPacksInGroup.push(wordPacksHolder[index]);
            for(var index3 = 0; index3 < $scope.wordPacksArray.length; index3++){
              if($scope.wordPacksArray[index3]._id == wordPacksHolder[index]._id){
                arrHold = $scope.getWordsFromWordIDs($scope.wordPacksArray[index3].words);
                for(var index4 = 0; index4 < arrHold.length; index4++){
                  if(allWordsInGroup.push(arrHold[index4]) == -1) {
                    allWordsInGroup.push(arrHold[index4]);
                  }
                }
              }
            }
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

    $scope.getStudentsInGroup = function (group, inGroup, notInGroup) {
      for (var index = 0; index < $scope.userStudents.length; index++) {
        for (var index2 = 0; index2 < $scope.userStudents[index].classList.length; index2++) {
          for (var index3 = 0; index3 < $scope.userStudents[index].classList[index2].groupList.length; index3++) {
            if ($scope.userStudents[index].classList[index2].groupList[index3] == group._id && inGroup.indexOf($scope.userStudents[index]) == -1) {
              inGroup.push($scope.userStudents[index]);
            }
          }
        }
      }
      for (var i = 0; i < $scope.userStudents.length; i++) {
        if (inGroup.indexOf($scope.userStudents[i]) == -1 && notInGroup.indexOf($scope.userStudents[i]) == -1) {
          notInGroup.push($scope.userStudents[i]);
        }
      }
    };

    $scope.viewWordsInWordPack = function(wordPack){
      $scope.viewWordPackWords = true;
      $scope.currentWordPack = wordPack;
      $scope.wordsInWordPack = [];
      for(var index = 0; index < $scope.wordPacksArray.length; index++){
        if($scope.wordPacksArray[index]._id == wordPack._id){
          $scope.wordsInWordPack = $scope.getWordsFromWordIDs($scope.wordPacksArray[index].words);
        }
      }
    };

    $scope.getAllWordsNotInGroup = function(allWordsInGroup, allWordsNotInGroup){
      var allWordInGroupIDs = [];
      for(var index = 0; index < allWordsInGroup.length; index++) {
        allWordInGroupIDs.push(allWordsInGroup[index]._id);
      }
      for(var index2 = 0; index2 < $scope.wordsArray.length; index2++) {
        if(allWordInGroupIDs.indexOf($scope.wordsArray[index2]._id) == -1 && allWordsNotInGroup.indexOf($scope.wordsArray[index2]) == -1){
          allWordsNotInGroup.push($scope.wordsArray[index2]);
        }
      }
    };

    $scope.getWordPacksNotInGroup = function(wordPacksInGroup, wordPacksNotInGroup, context){
      var indivWordPacksInGroupIDs = [];
      for(var index = 0; index < wordPacksInGroup.length; index++) {
        indivWordPacksInGroupIDs.push(wordPacksInGroup[index]._id);
      }
      for(var index2 = 0; index2 < $scope.wordPacksArray.length; index2++) {
        if(indivWordPacksInGroupIDs.indexOf($scope.wordPacksArray[index2]._id) == -1 && wordPacksNotInGroup.indexOf($scope.wordPacksArray[index2]) == -1){
          if(context == 'not'){
            if(!($scope.getContextBool($scope.wordPacksArray[index2]._id))){
              wordPacksNotInGroup.push($scope.wordPacksArray[index2]);
            }
          } else if(context == 'all'){
            wordPacksNotInGroup.push($scope.wordPacksArray[index2]);
          }
        }
      }
    };

    $scope.getContextBool = function(wordPackID){
      var toReturn = false;
      for(var index = 0; index < $scope.wordPacksHolder.length; index++) {
        if($scope.wordPacksHolder[index]._id == wordPackID){
          toReturn = $scope.wordPacksHolder[index].inContext;
        }
      }
      return toReturn;
    };

    $scope.addStudentToGroup = function (student, group){
      var classID = $scope.getClassIdOfGroupID(group._id);
      $http.put("/api/students/" + student + "/assignToGroup",
        {
          studentID: student._id,
          classID: classID,
          groupID: group._id
        }
      ).success(function () {
          $scope.studentsInGroup.push(student);
          for (var index2 = 0; index2 < $scope.studentsNotInGroup.length; index2++) {
            if (student == $scope.studentsNotInGroup[index2]) {
              $scope.studentsNotInGroup.splice(index2, 1);
            }
          }
        });
    };

    $scope.getClassIdOfGroupID = function(groupID){
      var toReturn = "";
      for(var index = 0; index < $scope.classArray.length; index++){
        for(var index2 = 0; index2 < $scope.classArray[index].groupList.length; index2++){
          if(groupID == $scope.classArray[index].groupList[index2]._id){
            toReturn = $scope.classArray[index]._id;
          }
        }
      }
      return toReturn;
    };

    $scope.addWordToGroup = function(word, group){
      var classID = $scope.getClassIdOfGroupID(group._id);
      $http.put('/api/users/' + $scope.currentUser._id + '/addWordIDtoGroup',
        {
          classID: classID,
          groupID: group._id,
          wordID: word._id
        }
      ).success(function () {
          $scope.allWordsInGroup.push(word);
          $scope.indivWordsInGroup.push(word);
          for (var index2 = 0; index2 < $scope.allWordsNotInGroup.length; index2++) {
            if (word == $scope.allWordsNotInGroup[index2]) {
              $scope.allWordsNotInGroup.splice(index2, 1);
            }
          }
        });
    };

    $scope.addWordPackToGroup = function(wordPack, group, filter){
      var classID = $scope.getClassIdOfGroupID(group._id);
      $http.put('/api/users/' + $scope.currentUser._id + '/addWordPackIDtoGroup',
        {
          classID: classID,
          groupID: group._id,
          wordPackID: wordPack._id
        }
      ).success(function () {
          if(filter == 'all'){
            $scope.allWordPacksInGroup.push(wordPack);
          } else if(filter == 'indiv'){
            $scope.allWordPacksInGroup.push(wordPack);
            $scope.indivWordPacksInGroup.push(wordPack);
            for (var index = 0; index < $scope.indivWordPacksNotInGroup.length; index++) {
              if (wordPack == $scope.indivWordPacksNotInGroup[index]) {
                $scope.indivWordPacksNotInGroup.splice(index, 1);
              }
            }
          }
          for (var index2 = 0; index2 < $scope.allWordPacksNotInGroup.length; index2++) {
            if (wordPack == $scope.allWordPacksNotInGroup[index2]) {
              $scope.allWordPacksNotInGroup.splice(index2, 1);
            }
          }
        });
    };

    $scope.removeWordPackFromGroup = function (wordPack, group) {
      var classID = $scope.getClassIdOfGroupID(group._id);
      var wpHolder = wordPack;
      $http.put('/api/users/' + $scope.currentUser._id + '/removeWordPackIDfromGroup',
        {
          classID: classID,
          groupID: group._id,
          wordPackID: wordPack._id
        }
      ).success(function () {
          console.log("removed wp ID from group!");
          if(wpHolder.inContext){
            $scope.allWordPacksNotInGroup.push(wpHolder);
            for (var i = 0; i < $scope.allWordPacksInGroup.length; i++) {
              if (wpHolder == $scope.allWordPacksInGroup[i]) {
                $scope.allWordPacksInGroup.splice(i, 1);
              }
            }
          } else {
            $scope.indivWordPacksNotInGroup.push(wpHolder);
            $scope.allWordPacksNotInGroup.push(wpHolder);
            for (var index = 0; index < $scope.indivWordPacksInGroup.length; index++) {
              if (wpHolder == $scope.indivWordPacksInGroup[index]) {
                $scope.indivWordPacksInGroup.splice(index, 1);
              }
            }
            for (var index2 = 0; index2 < $scope.allWordPacksInGroup.length; index2++) {
              if (wpHolder == $scope.allWordPacksInGroup[index2]) {
                $scope.allWordPacksInGroup.splice(index2, 1);
              }
            }
          }
        });
    };
  });
