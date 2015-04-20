'use strict';

angular.module('WordRiverApp')
    .controller('AssignWordsCtrl', function ($rootScope, $scope, $http, socket, Auth) {
      $scope.currentUser = Auth.getCurrentUser();
      $scope.categoryArray = [];
      $scope.groupArray = [];
      $scope.selectedCategories = [];
      $scope.selectedGroups = [];
      $scope.selectedStudents = [];
      $scope.studentArray = [];
      $scope.allStudents = [];
      $scope.checkedStudents = [];
      $scope.matchTiles = [];
      $scope.userTiles = [];
      $scope.studentCategories = [];
      $scope.groupView = true;

      ////////////////////////////////////////////////////////////////////////////
      //This is the section for getting all the things

      $scope.getAll = function () {
        $scope.userTiles = [];
        $scope.categoryArray = [];
        $scope.groupArray = [];
        $scope.selectedStudents = [];
        $scope.studentArray = [];
        $scope.categoryArray = $scope.currentUser.contextPacks;
        $scope.groupArray = $scope.currentUser.groupList;
        $scope.studentArray = $scope.currentUser.studentList;
        $scope.isCollapsed = false;
        $scope.groupedStudents = [];

        $http.get('/api/students').success(function (allStudents) {
          $scope.allStudents = allStudents;
          for (var i = 0; i < $scope.allStudents.length; i++) {
            for (var j = 0; j < $scope.studentArray.length; j++) {
              if ($scope.allStudents[i]._id == $scope.studentArray[j].studentID) {
                $scope.selectedStudents.push($scope.allStudents[i]);
              }
            }
          }
        });
        $http.get('/api/tile').success(function(allTiles){
          $scope.allTiles = allTiles;
          for (var i = 0; i<$scope.allTiles.length; i++){
            if($scope.allTiles[i].creatorID == $scope.currentUser._id){
              $scope.userTiles.push($scope.allTiles[i]);
            }
          }
        })
      };
      $scope.getAll();

      ////////////////////////////////////////////////////////////////////////////
      //This is the section for switching views

      $scope.groupView = true;
      $scope.categoryView = true;

      $scope.showGroupView = function(bool){
        $scope.groupView = bool;
      };
      $scope.showCategoryView = function(bool){
        $scope.categoryView = bool;
      };

      $scope.showMiddle = false;
      $scope.wordView = false;
      $scope.studentView = false;
      $scope.showGroup = false;
      $scope.showCategory = false;

      $scope.switchMiddle = function(section){
        if(section == "category"){
          $scope.showCategory = true;
          $scope.wordView = false;
          $scope.studentView = false;
          $scope.showGroup = false;
          $scope.showMiddle = true;
        } else if (section == "word"){
          $scope.showCategory = false;
          $scope.wordView = true;
          $scope.studentView = false;
          $scope.showGroup = false;
          $scope.showMiddle = true;
        } else if (section == "student"){
          $scope.showCategory = false;
          $scope.wordView = false;
          $scope.studentView = true;
          $scope.showGroup = false;
          $scope.showMiddle = true;
        } else if (section == "group"){
          $scope.showCategory = false;
          $scope.wordView = false;
          $scope.studentView = false;
          $scope.showGroup = true;
          $scope.showMiddle = true;
        }
      };

      ////////////////////////////////////////////////////////////////////////////
      //This is the section for checking boxes

      $scope.checkCategories = function (category) {
        var counter;
        for (var i = 0; i < $scope.selectedCategories.length; i++) {
          if ($scope.selectedCategories[i] == category) {
            $scope.selectedCategories.splice(i, 1);
            counter = 1;
          }
        }
        if (counter != 1) {
          $scope.selectedCategories.push(category);
        }
      };

      $scope.checkGroups = function (group) {
        var counter;
        for (var i = 0; i < $scope.selectedGroups.length; i++) {
          if ($scope.selectedGroups[i] == group) {
            $scope.selectedGroups.splice(i, 1);
            counter = 1;
          }
        }
        if (counter != 1) {
          $scope.selectedGroups.push(group);
        }
      };

      $scope.checkStudents = function (student) {
        var counter;
        for (var i = 0; i < $scope.checkedStudents.length; i++) {
          if ($scope.checkedStudents[i] == student) {
            $scope.checkedStudents.splice(i, 1);
            counter = 1;
          }
        }
        if (counter != 1) {
          $scope.checkedStudents.push(student);
        }
      };

      ////////////////////////////////////////////////////////////////////////////
      //This is the section for switching information in the middle

      //cat is short for category
      $scope.displayCatInfo = function (category) {
        $scope.switchMiddle("category");
        $scope.userTiles = [];
        $scope.matchStudent = [];
        $scope.matchGroup = [];
        $scope.matchTiles = [];
        $scope.categorySelected = category;
        $http.get('/api/tile').success(function (allTiles) {
          $scope.allTiles = allTiles;
          for (var i = 0; i < $scope.allTiles.length; i++) {
            if ($scope.allTiles[i].creatorID == $scope.currentUser._id) {
              $scope.userTiles.push($scope.allTiles[i]);
            }
          }
          $scope.matchTiles = [];
          for (var j = 0; j < $scope.userTiles.length; j++) {
            for (var z = 0; z < $scope.userTiles[j].contextTags.length; z++) {
              if ($scope.userTiles[j].contextTags[z].tagName == category) {
                $scope.matchTiles.push($scope.userTiles[j].name);
              }
            }
          }
        });
        for (var i=0; i<$scope.groupArray.length; i++){
          for (var j=0; j<$scope.groupArray[i].contextPacks.length; j++){
            if($scope.groupArray[i].contextPacks[j] == category){
              $scope.matchGroup.push($scope.groupArray[i].groupName);
            }
          }
        }
        for(var k=0; k<$scope.studentArray.length; k++){
          for(var l=0; l<$scope.studentArray[k].contextTags.length; l++){
            if($scope.studentArray[k].contextTags[l] == category){
              $scope.matchStudent.push($scope.studentArray[k]);
            }
          }
        }
      };

      $scope.displayGroupInfo = function (group){
        $scope.switchMiddle("group");
        $scope.groupSelected = group;
        $scope.matchCategories = [];
        $scope.matchStudents = [];
        $scope.matchTiles = [];
        for(var i = 0; i<$scope.groupArray.length; i++){
          if ($scope.groupArray[i].groupName == $scope.groupSelected){
            for(var j=0; j<$scope.groupArray[i].contextPacks.length; j++){
              $scope.matchCategories.push($scope.groupArray[i].contextPacks[j]);
            }
          }
        }
        for (var k = 0; k<$scope.studentArray.length; k++){
          for (var l = 0; l<$scope.studentArray[k].groupList.length; l++){
            if ($scope.studentArray[k].groupList[l] === group){
              $scope.matchStudents.push($scope.studentArray[k]);
            }
          }
        }
        for (var m = 0; m<$scope.matchCategories.length; m++){
          for (var n = 0; n<$scope.userTiles.length; n++){
            for (var o = 0; o<$scope.userTiles[n].contextTags.length; o++){
              if ($scope.matchCategories[m] == $scope.userTiles[n].contextTags[o].tagName){
                $scope.matchTiles.push($scope.userTiles[n]);
              }
            }
          }
        }
      };

      $scope.displayStudentInfo = function (student){
        $scope.studentSelected = student;
        $scope.switchMiddle("student");
        $scope.matchGroup = [];
        $scope.studentCategories = [];
        $scope.matchTiles = [];
        $scope.matchTileIds = [];
        for (var j = 0; j < $scope.currentUser.studentList.length; j++){
          if ($scope.currentUser.studentList[j].studentID == student._id){
            $scope.matchGroup = $scope.currentUser.studentList[j].groupList;
            $scope.studentCategories = $scope.currentUser.studentList[j].contextTags;
          }
        }
        for (var i = 0; i < $scope.selectedStudents.length; i++){
          if ($scope.selectedStudents[i]._id == student._id){
            $scope.matchTileIds = $scope.selectedStudents[i].tileBucket;
          }
        }
        for (var k = 0; k < $scope.matchTileIds.length; k++){
          for (var l = 0; l < $scope.allTiles.length; l++){
            if ($scope.allTiles[l]._id == $scope.matchTileIds[k]){
              $scope.matchTiles.push($scope.allTiles[l]);
            }
          }
        }
        for (var z = 0; z < $scope.matchTiles.length; z++) {
          for (var a = 0; a < $scope.matchTiles.length; a++) {
            if ($scope.matchTiles[z] == $scope.matchTiles[a]) {
              $scope.matchTiles.splice(z, 1);
            }
          }
        }
      };

      $scope.displayTileInfo = function (word){
        $scope.tileSelected = word;
        $scope.switchMiddle("word");
        $scope.matchCategories = [];
        $scope.matchGroup = [];
        $scope.matchStudent = [];
        for (var i = 0; i < $scope.userTiles.length; i++){
          if ($scope.userTiles[i].name == word.name){
            for(var j = 0; j < $scope.userTiles[i].contextTags.length; j++){
              $scope.matchCategories.push($scope.userTiles[i].contextTags[j].tagName);
            }
          }
        }
        for (var l = 0; l < $scope.groupArray.length; l++){
          for (var m = 0; m < $scope.groupArray[l].contextPacks.length; m++){
            for (var n = 0; n < $scope.matchCategories.length; n++){
              if($scope.groupArray[l].contextPacks[m] == $scope.matchCategories[n]){
                $scope.matchGroup.push($scope.groupArray[l].groupName);
              }
            }
          }
        }
        for (var o = 0; o < $scope.selectedStudents.length; o++){
          for (var p = 0; p < $scope.selectedStudents[o].tileBucket.length; p++){
            if(word._id == $scope.selectedStudents[o].tileBucket[p]){
              $scope.matchStudent.push($scope.selectedStudents[o]);
            }
          }
        }

      };

      $scope.displayStudentHelper = function(student){
        for(var i = 0; i < $scope.selectedStudents.length; i++){
          if(student.studentID == $scope.selectedStudents[i]._id){
            $scope.displayStudentInfo($scope.selectedStudents[i]);
          }
        }
      };

      $scope.displayTileHelper = function(tile){
        for (var i = 0; i < $scope.allTiles.length; i++){
          if ($scope.allTiles[i].name == tile){
            $scope.displayTileInfo($scope.allTiles[i]);
            return;
          }
        }
      };
      ////////////////////////////////////////////////////////////////////////////
      //This is the section for the unassign functions

      //Category view unassign functions

      $scope.unassignTileFromCategory = function (word, category){
        $scope.confirmUnassign(word, category);
      };

      $scope.unassignGroupFromCategory = function (group, category){
        $scope.confirmUnassign(group, category);
      };

      $scope.unassignStudentFromCategory = function (student, category){
        $scope.confirmUnassign(student.firstName, category);
      };

      //Tile view unassign functions

      $scope.unassignWordFromCategory = function (category, word){
        $scope.confirmUnassign(category, word);
      };

      $scope.unassignWordFromGroup = function (group, word){
        $scope.confirmUnassign(group, word);
      };

      $scope.unassignWordFromStudent = function (student, word){
        $scope.confirmUnassign(student, word);
      };

      //Group view unassign functions
      $scope.unassignStudentFromGroup = function (student, group){
        $scope.confirmUnassign(student, group);
      };

      $scope.unassignCategoryFromGroup = function (category, group){
        $scope.confirmUnassign(category, group);
      };

      $scope.unassignTileFromGroup = function (tile, group){
        $scope.confirmUnassign(tile, group);
      };

      //Student view unassign function
      $scope.unassignGroupFromStudent = function (group, student){
        $scope.confirmUnassign(group, student);
      };
      $scope.unassignCategoryFromStudent = function (category, student){
        $scope.confirmUnassign(category, student);
      };
      $scope.unassignTileFromStudent = function (tile, student){
        $scope.confirmUnassign(tile, student);
      };

      $scope.confirmUnassign = function (thing, place){
        confirm("Are you sure that you would like to unassign " + thing + " from "+ place + "?")
      };

      ////////////////////////////////////////////////////////////////////////////
      //This is the section for the assign function and its helpers

      $scope.assignWords = function () {
        if($scope.groupView && $scope.categoryView){
          //Function to add selected categories to selected groups.
        } else if ($scope.groupView && !$scope.categoryView){
          //Function to add selected words to selected groups.
        } else if (!$scope.groupView && $scope.categoryView){
          //Function to add selected categories to selected students.
        } else if (!$scope.groupView && !$scope.categoryView){
          //Function to add selected words to selected students.
        }

        //Old code from last time this function worked

        //$scope.individualStudentCategories = [];
        //$scope.userSideStudentCategories = [];
        ////Checks to make sure there are selected categories
        //if ($scope.selectedCategories.length > 0) {
        //  //For each of the checked students, push their packs onto an array
        //  for (var i = 0; i < $scope.checkedStudents.length; i++) {
        //    $scope.studentCategoryArray = [];
        //    for (var a = 0; a < $scope.checkedStudents[i].contextTags.length; a++){
        //      $scope.studentCategoryArray.push({
        //        tagName:$scope.checkedStudents[i].contextTags[a].tagName,
        //        creatorID:$scope.checkedStudents[i].contextTags[a].creatorID
        //      })
        //    }
        //    $scope.checkCategoryDups($scope.studentCategoryArray, $scope.selectedCategories);
        //    //Push the selected categories onto the array locally
        //    for (var j = 0; j < $scope.selectedCategories.length; j++) {
        //      $scope.studentCategoryArray.push({
        //        tagName:$scope.selectedCategories[j],
        //        creatorID:$scope.currentUser._id
        //      });
        //    }
        //    $http.patch('/api/students/' + $scope.checkedStudents[i]._id,
        //      {contextTags: $scope.studentCategoryArray});
        //  }
        //  //Go through each selected group
        //  console.log($scope.selectedGroups.length);
        //  for (var k=0; k <$scope.selectedGroups.length; k++){
        //    //Check for duplicate categories to the ones we want to push
        //    for (var l = 0; l<$scope.groupArray.length; l++){
        //      $scope.checkCategoryDups($scope.groupArray[l].contextPacks,$scope.selectedCategories);
        //      if($scope.selectedGroups[k].groupName == $scope.groupArray[l].groupName){
        //        for(var m=0; m<$scope.selectedCategories.length; m++){
        //          $scope.groupArray[l].contextPacks.push($scope.selectedCategories[m]);
        //        }
        //      }
        //    }
        //    //Update the group's categories
        //    $http.patch('/api/users/'+$scope.currentUser._id+'/group',{
        //      groupList:$scope.groupArray
        //    });
        //  }
        //}
        //$scope.getAll();
      };

      $scope.checkCategoryDups = function (studentCategoryArray, checkedCategoryArray, checkedElement) {
        for (var i = 0; i < studentCategoryArray.length; i++) {
          for (var j = 0; j < checkedCategoryArray.length; j++) {
            if (studentCategoryArray[i].checkedElement == checkedCategoryArray[j].checkedElement) {
              studentCategoryArray.splice(i, 1);
            }
          }
        }
      };

      $scope.studentsInGroupAssignment = function(group) {
        for(var i = 0; i < $scope.studentArray.length; i++){
          console.log("this is the student group list " + $scope.studentArray[i].groupList.indexOf("Group E"));
          console.log($scope.studentArray[i].groupList.indexOf(group));
          console.log(group.groupName);
          if ($scope.studentArray[i].groupList.indexOf(group.groupName) > -1) {
            console.log("we are in the if statement");
            $scope.groupedStudents.push($scope.studentArray[i]);
          }
        }
        console.log($scope.groupedStudents);
        $scope.groupedStudents = [];

      };
    });
