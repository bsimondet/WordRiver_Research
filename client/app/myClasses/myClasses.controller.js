'use strict';

angular.module('WordRiverApp')
  .controller('MyClassesCtrl', function ($scope, $location, $http, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.headerTitle = "My Classes";
    //For holding the objects we grab right away
    $scope.classArray = [];
    $scope.contextPacksArray = [];
    $scope.positionToAdd = 0;
    $scope.contextPacksHolder = [];
/*    $scope.contextPacksHolder = [{
      "_id": null,
      "name": null,
      "wordPacks": {
        "name": null,
        "words": []
      },
      "words": []
    }];*/
    $scope.wordPacksHolder = [];
/*    $scope.wordPacksHolder = [{
     "_id": null,
     "name": null,
     "words": []
     }];*/
    $scope.wordPacksArray = [];
    $scope.wordPacksArrayInContext = [];
    $scope.wordPacksArrayNonContext = [];
    $scope.wordPacksArrayInContextID = [];
    $scope.wordsArray = [];
    $scope.groupsArray = [];
    //For collapsing
    $scope.isGroupsCollapsed = false;
    $scope.wpIsCollapsed = false;
    //For group views
    $scope.viewStudents = false;
    $scope.viewWords = false;
    $scope.viewWordPacks = false;
    $scope.viewContextPacks = false;
    $scope.viewIndivWordPacks = false;
    $scope.viewAllWordPacks = false;
    //For class/group/context views
    $scope.viewClassInfo = true;
    $scope.viewGroupInfo = false;
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
    $scope.userStudents = [];
    //For viewing class information
    $scope.studentsInClass = [];
    //For viewing group information
    $scope.studentsInGroup = [];
    $scope.wordsInGroup = [];
    $scope.wordIDsInGroup = [];
    $scope.wordPacksInGroup = [];
    $scope.nonContextWordPacksInGroup = [];
    $scope.wordPackIDsInGroup = [];
    $scope.contextPacksInGroup = [];
    $scope.wordsInWordPack = [];
    $scope.currentWordPack = null;
    $scope.viewWordPackWords = false;

    $scope.showWordPackSort = false;
    $scope.showWordSort = false;

    //Toggles between classes and groups
    $scope.toggleClassGroup = function(view) {
      if(view == 'class'){
        $scope.headerTitle = "My Classes";
        $scope.viewClassInfo = true;
        $scope.viewGroupInfo = false;
        $scope.viewStudents = false;
        $scope.hideGroupItems();
      } else if (view == 'group') {
        $scope.headerTitle = $scope.currentGroup.groupName;
        $scope.viewClassInfo = false;
        $scope.viewGroupInfo = true;
        $scope.viewStudents = true;
        $scope.hideGroupItems();
      }
    };

    $scope.hideGroupItems = function() {
      $scope.viewWords = false;
      $scope.viewWordPacks = false;
      $scope.viewContextPacks = false;
    };

    $scope.viewGroupItems = function(item) {
      if(item == 'wordPacks'){
        $scope.showWordPackSort = true;
        $scope.showWordSort = false;
        $scope.wordPackFilter('contextPacks');
      } else if (item == 'words'){
        $scope.wordFilter('all');
        $scope.wordPackFilter('off');
        $scope.showWordPackSort = false;
        $scope.showWordSort = true;
      }
    };

    //TODO: Need a word filter as well
    $scope.wordPackFilter = function(item) {
      if(item == 'contextPacks'){
        $scope.viewContextPacks = true;
        $scope.viewIndivWordPacks = false;
        $scope.viewAllWordPacks = false;
      } else if (item == 'individual'){
        $scope.viewContextPacks = false;
        $scope.viewIndivWordPacks = true;
        $scope.viewAllWordPacks = false;
      } else if (item == 'all') {
        $scope.viewContextPacks = false;
        $scope.viewIndivWordPacks = false;
        $scope.viewAllWordPacks = true;
      } else if (item == 'off') {
        $scope.viewContextPacks = false;
        $scope.viewIndivWordPacks = false;
        $scope.viewAllWordPacks = false;
      }
    };

    $scope.wordFilter = function(item) {
      if(item == 'individual'){

      } else if (item == 'all') {

      }
    };

    $scope.inArray = function (array, item) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] == item) {
          return true;
        }
      }
      return false;
    };

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
      $http.get('/api/tile').success(function(words) {
        $scope.wordsArray = words;
      });
      $scope.wordsArray = $scope.checkForDuplicates($scope.wordsArray);
    };

    $scope.getWordsStudentsClasses = function(){
      $scope.getClasses();
      $scope.getStudents();
      $scope.getWords();
    };
    $scope.getWordsStudentsClasses();

    $scope.getWordPacks = function(){
      $scope.wordPacksArray = [];
      $http.get('/api/categories/').success(function(wordPacks){
        for(var index = 0; index < wordPacks.length; index++){
          if(wordPacks[index].creatorID == $scope.currentUser._id){
            $scope.wordPacksArray.push(wordPacks[index]);
          }
        }
        $scope.manageWordPacks($scope.wordPacksArray);
        $scope.wordPacksArray = $scope.checkForDuplicates($scope.wordPacksArray);
      });
    };

    $scope.manageWordPacks = function(wordPackArr){
      $scope.wordPacksHolder = [];
      for(var index = 0; index < wordPackArr.length; index++) {
        $scope.wordPacksHolder.push({
          "_id": wordPackArr[index]._id,
          "name": wordPackArr[index].name,
          "words": $scope.getWordsForWordPack(wordPackArr[index].wordsInWordPack)
        });
      }
    };

    $scope.getWordPacks();

    $scope.getNonContextWordPacks = function(){
      $scope.wordPacksArrayNonContext = [];
      for(var index = 0; index < $scope.wordPacksArray.length; index++) {
        if($scope.wordPacksArrayInContext.indexOf($scope.wordPacksArray[index]) == -1){
          $scope.wordPacksArrayNonContext.push($scope.wordPacksArray[index]);
        }
      }
    };

    $scope.getContextPacks = function(){
      $scope.contextPacksArray = [];
      $http.get('/api/contextPacks/').success(function(contextPacks){
        for(var index = 0; index < contextPacks.length; index++){
          if(contextPacks[index].creatorID == $scope.currentUser._id){
            $scope.contextPacksArray.push(contextPacks[index]);
          }
        }
        $scope.manageContextPacks($scope.contextPacksArray);
        $scope.contextPacksArray = $scope.checkForDuplicates($scope.contextPacksArray);
      });
    };

    $scope.manageContextPacks = function(contextArr){
      $scope.contextPacksHolder = [];
      $scope.wordPacksArrayInContext = [];
      $scope.wordPacksArrayInContextID = [];
      for(var index = 0; index < contextArr.length; index++) {
        $scope.contextPacksHolder.push({
          "_id": contextArr[index]._id,
          "name": contextArr[index].name,
          "wordPacks": $scope.getWordPacksInfoForContextPacks(contextArr[index]),
          "words": $scope.getWordsInfo(index)
        });
      }
      $scope.getNonContextWordPacks();
    };
    $scope.getContextPacks();

    $scope.getWordPacksInfoForContextPacks = function(currentContextPack){
      var toReturn = [];
      var wordIDArr = [];
      for(var index = 0; index < $scope.wordPacksArray.length; index++) {
        for(var index2 = 0; index2 < currentContextPack.wordPacksInContextPack.length; index2++) {
          if($scope.wordPacksArray[index]._id == currentContextPack.wordPacksInContextPack[index2]){
            wordIDArr = $scope.wordPacksArray[index].wordsInWordPack;
            var arrHold = $scope.getWordsForWordPack(wordIDArr);
            toReturn.push({
              "_id": $scope.wordPacksArray[index]._id,
              "name": $scope.wordPacksArray[index].name,
              "words": arrHold
            });
            $scope.wordPacksArrayInContext.push($scope.wordPacksArray[index]);
          }
        }
      }
      return toReturn;
    };

    $scope.getWordsForWordPack = function (wordIDArr) {
      var toReturn = [];
      for(var index = 0; index < $scope.wordsArray.length; index++) {
        for (var index2 = 0; index2 < wordIDArr.length; index2++) {
          if($scope.wordsArray[index]._id == wordIDArr[index2]){
            toReturn.push($scope.wordsArray[index2]);
          }
        }
      }
      return toReturn;
    };

    $scope.getWordsInfo = function(index){
      var currentContextPack = $scope.contextPacksArray[index];
      var toReturn = [];
      for(var index = 0; index < $scope.wordsArray.length; index++) {
        for (var index2 = 0; index2 < currentContextPack.wordsInContextPack.length; index2++) {
          if($scope.wordsArray[index2]._id == currentContextPack.wordsInContextPack[index2]){
            toReturn.push($scope.wordsArray[index2]);
          }
        }
      }
      return toReturn;
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
      $scope.toggleClassGroup('group');
      $scope.wordPacksInGroup = [];
      $scope.wordsInGroup = [];
      $scope.currentGroupClass = myClass;
      $scope.getStudentsInGroup($scope.currentGroup);
      $scope.getIDsInGroup($scope.currentGroup);
      $scope.getGroupArray($scope.wordPackIDsInGroup, $scope.wordPacksArray, $scope.wordPacksInGroup);
      $scope.getGroupArray($scope.wordIDsInGroup, $scope.wordsArray, $scope.wordsInGroup);
      $scope.getNonContextWordPacksForGroups($scope.wordPacksInGroup);
    };

    $scope.getNonContextWordPacksForGroups = function(wordPacksInGroup){
      for(var index = 0; index < wordPacksInGroup.length; index++) {
        if($scope.wordPacksArrayNonContext.indexOf(wordPacksInGroup[index]) != -1){
          $scope.nonContextWordPacksInGroup.push(wordPacksInGroup[index]);
        }
      }
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

    $scope.getStudentsInGroup = function(group){
      $scope.studentsInGroup = [];
      for(var index = 0; index < $scope.userStudents.length; index++){
        for(var index2 = 0; index2 < $scope.userStudents[index].classList.length; index2++){
          for(var index3 = 0; index3 < $scope.userStudents[index].classList[index2].groupList.length; index3++) {
            if ($scope.userStudents[index].classList[index2].groupList[index3] == group._id) {
              $scope.studentsInGroup.push($scope.userStudents[index]);
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

    $scope.viewWordsInWordPack = function(wordPack, option){
      if(option == 'group'){
        $scope.viewWordPackWords = true;
      } else if (option == 'context'){
        $scope.viewWordPackWordsInContextPack = true;
      }
      $scope.wordsInWordPack = [];
      $scope.currentWordPack = wordPack;
      for(var index = 0; index < $scope.wordsArray.length; index++){
        for(var index2 = 0; index2 < $scope.currentWordPack.wordsInWordPack.length; index2++){
          if($scope.wordsArray[index]._id == $scope.currentWordPack.wordsInWordPack[index2]){
            $scope.wordsInWordPack.push($scope.wordsArray[index]);
          }
        }
      }
    };
  });
