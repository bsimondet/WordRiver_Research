'use strict';

angular.module('WordRiverApp')
  .controller('MyClassesCtrl', function ($scope, $location, $http, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
    //For holding the objects we grab right away
    $scope.classArray = [];
    $scope.contextPacksArray = [];
    $scope.wordPacksArray = [];
    $scope.wordsArray = [];
    $scope.groupsArray = [];
    //For collapsing
    $scope.isGroupsCollapsed = false;
    //For group views
    $scope.viewStudents = false;
    $scope.viewWords = false;
    $scope.viewWordPacks = false;
    $scope.viewContextPacks = false;
    //For class/group/context views
    $scope.viewClassInfo = true;
    $scope.viewGroupInfo = false;
    $scope.viewContextInfo = false;
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
    $scope.wordPackIDsInGroup = [];
    $scope.contextPacksInGroup = [];
    $scope.contextPackIDsInGroup = [];
    $scope.wordsInWordPack = [];
    $scope.currentWordPack = null;
    $scope.viewWordPackWords = false;
    //For viewing context pack information
    $scope.viewWordPacksInContextPack = false;
    $scope.viewWordsInContextPack = false;
    $scope.viewWordPackWordsInContextPack = false;


    $scope.toggleClassGroupContext = function(view) {
      if(view == 'class'){
        $scope.viewClassInfo = true;
        $scope.viewGroupInfo = false;
        $scope.viewContextInfo = false;
        $scope.hideGroupItems();
        $scope.hideContextItems();
      } else if (view == 'group') {
        $scope.viewGroupInfo = true;
        $scope.viewClassInfo = false;
        $scope.viewContextInfo = false;
        $scope.hideGroupItems();
        $scope.hideContextItems();
      } else if (view == 'contextPack'){
        $scope.viewContextInfo = true;
        $scope.viewClassInfo = false;
        $scope.viewGroupInfo = false;
        $scope.hideGroupItems();
        $scope.hideContextItems();
      }
    };

    $scope.hideGroupItems = function() {
      $scope.viewStudents = false;
      $scope.viewWords = false;
      $scope.viewWordPacks = false;
      $scope.viewContextPacks = false;
    };

    $scope.toggleGroupItems = function(item) {
      if(item == 'wordPacks'){
        $scope.viewContextPacks = false;
        $scope.viewStudents = false;
        $scope.viewWords = false;
        $scope.viewWordPacks = true;
        $scope.viewWordPackWords = false;
      } else if (item == 'words') {
        $scope.viewContextPacks = false;
        $scope.viewStudents = false;
        $scope.viewWords = true;
        $scope.viewWordPacks = false;
        $scope.viewWordPackWords = false;
      } else if (item == 'students'){
        $scope.viewContextPacks = false;
        $scope.viewStudents = true;
        $scope.viewWords = false;
        $scope.viewWordPacks = false;
        $scope.viewWordPackWords = false;
      } else if (item == 'contextPack'){
        $scope.viewContextPacks = true;
        $scope.viewStudents = false;
        $scope.viewWords = false;
        $scope.viewWordPacks = false;
        $scope.viewWordPackWords = false;
      }
    };

    $scope.hideContextItems = function(){
      $scope.viewWordPacksInContextPack = false;
      $scope.viewWordsInContextPack = false;
    };

    $scope.toggleContextPackItems = function(item){
      if(item == 'wordPacks'){
        $scope.viewWordPacksInContextPack = true;
        $scope.viewWordsInContextPack = false;
        $scope.viewWordPackWordsInContextPack = false;
      } else if (item == 'words') {
        $scope.viewWordPacksInContextPack = false;
        $scope.viewWordsInContextPack = true;
        $scope.viewWordPackWordsInContextPack = false;
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
    $scope.getClasses();

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
    $scope.getStudents();

    $scope.getContextPacks = function(){
      $scope.contextPacksArray = [];
      $http.get('/api/contextPacks/').success(function(contextPacks){
        $scope.contextPacksArray = contextPacks;
      });
      $scope.contextPacksArray = $scope.checkForDuplicates($scope.contextPacksArray);
    };
    $scope.getContextPacks();

    $scope.getWordPacks = function(){
      $scope.wordPacksArray = [];
      $http.get('/api/categories/').success(function(wordPacks){
        $scope.wordPacksArray = wordPacks;
      });
      $scope.wordPacksArray = $scope.checkForDuplicates($scope.wordPacksArray);
    };
    $scope.getWordPacks();

    $scope.getWords = function(){
      $scope.wordsArray = [];
      $http.get('/api/tile').success(function(words) {
        $scope.wordsArray = words;
      });
      $scope.wordsArray = $scope.checkForDuplicates($scope.wordsArray);
    };
    $scope.getWords();


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
          $scope.toggleClassGroupContext('class');
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

    $scope.viewStudents = function(classID){
      $scope.studentsInClass = [];
      for(var index = 0; index < $scope.userStudents.length; index++){
        for(var index2 = 0; index2 < $scope.userStudents[index].classList.length; index2++){
          if($scope.userStudents[index].classList[index2]._id == classID){
            $scope.studentsInClass.push($scope.userStudents[index]);
          }
        }
      }
    };

    $scope.viewGroups = function(group, myClass){
      $scope.toggleClassGroupContext('group')
      $scope.contextPacksInGroup = [];
      $scope.wordPacksInGroup = [];
      $scope.wordsInGroup = [];
      //currentGroup is used in html side as well
      $scope.currentGroup = group;
      $scope.currentGroupClass = myClass;
      $scope.getStudentsInGroup($scope.currentGroup);
      $scope.getIDsInGroup($scope.currentGroup);
      $scope.getGroupArray($scope.contextPackIDsInGroup, $scope.contextPacksArray, $scope.contextPacksInGroup);
      $scope.getGroupArray($scope.wordPackIDsInGroup, $scope.wordPacksArray, $scope.wordPacksInGroup);
      $scope.getGroupArray($scope.wordIDsInGroup, $scope.wordsArray, $scope.wordsInGroup);
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
      $scope.contextPacksInGroup = [];
      $scope.wordPackIDsInGroup = [];
      $scope.wordIDsInGroup = [];
      for (var index = 0; index < $scope.classArray.length; index++) {
        for (var index2 = 0; index2 < $scope.classArray[index].groupList.length; index2++) {
          if ($scope.classArray[index].groupList[index2]._id == group._id) {
            $scope.contextPackIDsInGroup = $scope.classArray[index].groupList[index2].contextPacks;
            $scope.wordPackIDsInGroup = $scope.classArray[index].groupList[index2].wordPacks;
            $scope.wordIDsInGroup = $scope.classArray[index].groupList[index2].words;
          }
        }
      }
    };

    $scope.viewContextPackInfo = function(contextPack) {
      $scope.toggleClassGroupContext('contextPack');
      $scope.currentContextPack = contextPack;
      $scope.wordsInContextPack = [];
      $scope.wordPacksInContextPack = [];
      for(var index = 0; index < $scope.wordPacksArray.length; index++){
        for(var index2 = 0; index2 < $scope.currentContextPack.wordPacksInContextPack.length; index2++){
          if($scope.wordPacksArray[index]._id == $scope.currentContextPack.wordPacksInContextPack[index2]){
            $scope.wordPacksInContextPack.push($scope.wordPacksArray[index]);
          }
        }
      }
      for(var index3 = 0; index3 < $scope.wordsArray.length; index3++){
        for(var index4 = 0; index4 < $scope.currentContextPack.wordsInContextPack.length; index4++){
          if($scope.wordsArray[index3]._id == $scope.currentContextPack.wordsInContextPack[index4]){
            $scope.wordsInContextPack.push($scope.wordsArray[index3]);
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
