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
    $scope.selectedWords = [];
    $scope.matchTiles = [];
    $scope.userTiles = [];
    $scope.studentCategories = [];
    $scope.groupView = true;
    $scope.groupedStudents = [];


    ////////////////////////////////////////////////////////////////////////////
    //This is the section for getting all the things

    $scope.getAll = function () {
      $scope.userTiles = [];
      $scope.userCategories = [];
      $scope.userStudents = [];
      $scope.userGroups = [];
      $scope.isCollapsed = false;
      $scope.userGroups = $scope.currentUser.groupList;
      $http.get('/api/categories/' + $scope.currentUser._id + '/categories').success(function(userCategories){
        $scope.userCategories = userCategories;
      });
      $http.get('/api/tile/' + $scope.currentUser._id + '/tiles').success(function(userTiles){
        $scope.userTiles = userTiles;
      });
      $http.get('/api/students/' + $scope.currentUser._id + '/students').success(function(userStudents){
        $scope.userStudents = userStudents;
      });
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
      for (var i = 0; i < $scope.selectedStudents.length; i++) {
        if ($scope.selectedStudents[i] == student) {
          $scope.selectedStudents.splice(i, 1);
          counter = 1;
        }
      }
      if (counter != 1) {
        $scope.selectedStudents.push(student);
      }
    };

    $scope.checkWords = function (word) {
      var counter = 0;
      for(var i = 0; i < $scope.selectedWords.length; i++){
        if($scope.selectedWords[i] == word) {
          $scope.selectedWords.splice(i,1);
          counter = 1;
        }
      }
      if(counter != 1){
        $scope.selectedWords.push(word);
      }
    };

    ////////////////////////////////////////////////////////////////////////////
    //This is the section for switching information in the middle

    //cat is short for category
    $scope.displayCatInfo = function (category) {
      $scope.switchMiddle("category");
      $scope.categorySelected = category.name;
      $scope.matchStudent = [];
      $scope.matchGroup = [];
      $scope.matchTiles = [];
      for (var j = 0; j < $scope.userTiles.length; j++) {
        for (var z = 0; z < $scope.userTiles[j].contextTags.length; z++) {
          if ($scope.userTiles[j].contextTags[z].tagName == category._id) {
            $scope.matchTiles.push($scope.userTiles[j]);
          }
        }
      }
      for (var i=0; i<$scope.userGroups.length; i++){
        for (var m=0; m<$scope.userGroups[i].contextPacks.length; m++){
          if($scope.userGroups[i].contextPacks[m] == category._id){
            $scope.matchGroup.push($scope.userGroups[i]);
          }
        }
      }
      for(var k=0; k<$scope.userStudents.length; k++){
        for(var l=0; l<$scope.userStudents[k].contextTags.length; l++){
          if($scope.userStudents[k].contextTags[l] == category._id){
            $scope.matchStudent.push($scope.userStudents[k]);
          }
        }
      }
    };

    $scope.displayGroupInfo = function (group){
      $scope.switchMiddle("group");
      $scope.groupSelected = group.groupName;
      $scope.matchCategoryIds = [];
      $scope.matchCategories = [];
      $scope.matchStudents = [];
      $scope.matchTiles = [];
      for(var i = 0; i<$scope.userGroups.length; i++){
        if ($scope.userGroups[i]._id == group._id){
          for(var j=0; j<$scope.userGroups[i].contextPacks.length; j++){
            $scope.matchCategoryIds.push($scope.userGroups[i].contextPacks[j]);
          }
        }
      }
      for(var z = 0; z < $scope.matchCategoryIds.length; z++){
        for(var v = 0; v < $scope.userCategories.length; v++){
          if($scope.matchCategoryIds[z] == $scope.userCategories[v]._id){
            $scope.matchCategories.push($scope.userCategories[v]);
          }
        }
      }
      for (var k = 0; k<$scope.userStudents.length; k++){
        for (var l = 0; l<$scope.userStudents[k].groupList.length; l++){
          if ($scope.userStudents[k].groupList[l] === group._id){
            $scope.matchStudents.push($scope.userStudents[k]);
          }
        }
      }
      for (var m = 0; m<$scope.userGroups.length; m++){
        for (var n = 0; n<$scope.userTiles.length; n++){
          if ($scope.userGroups[m]._id == group._id){
            for(var p = 0; p < $scope.userGroups[m].freeTiles.length; m++)
              $scope.matchTiles.push($scope.userGroups[m].freeTiles[p]);
              console.log($scope.userGroups[m].freeTiles[p]);
          }
        }
      }
    };

    $scope.displayStudentInfo = function (student){
      $scope.studentSelected = student;
      $scope.switchMiddle("student");
      $scope.matchGroups = [];
      $scope.studentCategories = [];
      $scope.matchTiles = [];
      $scope.matchTileIds = [];
      $scope.matchGroupIds = [];
      $scope.matchCategoryIds = [];
      $scope.matchCategories = [];
      for (var j = 0; j < $scope.userStudents.length; j++){
        if ($scope.userStudents[j]._id == student._id){
          $scope.matchCategoryIds = $scope.userStudents[j].contextTags;
          $scope.matchTileIds = $scope.userStudents[j].tileBucket;
        }
      }
      for (var i = 0; i < $scope.userStudents.length; i++){
        if ($scope.userStudents[i]._id == student._id){
          $scope.matchGroupIds = $scope.userStudents[i].groupList;
        }
      }
      for (var k = 0; k < $scope.matchTileIds.length; k++){
        for (var l = 0; l < $scope.userTiles.length; l++){
          if ($scope.userTiles[l]._id == $scope.matchTileIds[k]){
            $scope.matchTiles.push($scope.userTiles[l]);
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
      for (var b = 0; b < $scope.matchGroupIds.length; b++){
        for (var v = 0; v < $scope.userGroups.length; v++){
          if ($scope.userGroups[v]._id == $scope.matchGroupIds[b]){
            $scope.matchGroups.push($scope.userGroups[v]);
          }
        }
      }
      for (var q = 0; q < $scope.matchCategoryIds.length; q++){
        for (var r = 0; r < $scope.currentUser.contextPacks.length; r++){
          if ($scope.currentUser.contextPacks[r] == $scope.matchCategoryIds[q]){
            $scope.matchCategories.push($scope.userCategories[r]);
          }
        }
      }
    };

    $scope.displayTileInfo = function (word){
      $scope.tileSelected = word;
      $scope.switchMiddle("word");
      $scope.matchCategoryIds = [];
      $scope.matchCategories = [];
      $scope.matchGroup = [];
      $scope.matchStudent = [];
      for (var i = 0; i < $scope.userTiles.length; i++){
        if ($scope.userTiles[i].name == word.name){
          for(var j = 0; j < $scope.userTiles[i].contextTags.length; j++){
            $scope.matchCategoryIds.push($scope.userTiles[i].contextTags[j]);
          }
        }
      }
      for (var q = 0; q < $scope.matchCategoryIds.length; q++){
        for (var r = 0; r < $scope.userCategories.length; r++){
          if ($scope.userCategories[r]._id == $scope.matchCategoryIds[q].tagName){
            $scope.matchCategories.push($scope.userCategories[r]);
          }
        }
      }
      for (var l = 0; l < $scope.userGroups.length; l++){
        for (var m = 0; m < $scope.userGroups[l].contextPacks.length; m++){
          for (var n = 0; n < $scope.matchCategories.length; n++){
            if($scope.userGroups[l].contextPacks[m] == $scope.matchCategories[n]._id){
              $scope.matchGroup.push($scope.userGroups[l]);
            }
          }
        }
      }
      for (var o = 0; o < $scope.userStudents.length; o++){
        for (var p = 0; p < $scope.userStudents[o].tileBucket.length; p++){
          if(word._id == $scope.userStudents[o].tileBucket[p]){
            $scope.matchStudent.push($scope.userStudents[o]);
          }
        }
      }
    };

    $scope.displayStudentHelper = function(student){
      student._id = student.studentID;
      $scope.displayStudentInfo(student);
    };

////////////////////////////////////////////////////////////////////////////
//This is the section for the unassign functions

//Category view unassign functions
    $scope.getRealCategory = function(category){
      for(var z = 0; z < $scope.userCategories.length; z ++){
        if ($scope.userCategories[z].name == category){
          $scope.useCategory = $scope.userCategories[z];
        }
      }
    };

    $scope.unassignTileFromCategory = function (word, category, view){
      $scope.confirmUnassign(word.name, category);
      //Tile API remove from context tags [{tagName:id}]
      $scope.getRealCategory(category);
      for(var i = 0; i < $scope.userTiles.length; i++){
        if($scope.userTiles[i]._id == word._id){
          for (var j = 0; j < $scope.userTiles[i].contextTags.length; j++){
            if($scope.useCategory._id == $scope.userTiles[i].contextTags[j].tagName){
              $scope.userTiles[i].contextTags.splice(j,1);
              $http.patch('/api/tile/'+word._id,
                {contextTags: $scope.userTiles[i].contextTags}).success(function(){
                  $scope.getAll();
                });
              $scope.displayCatInfo($scope.useCategory);
            }
          }
        }
      }
    };

    $scope.unassignGroupFromCategory = function (group, category, view){
      $scope.confirmUnassign(group.groupName, category);
      $scope.getRealCategory(category);
      for (var i = 0; i < $scope.userGroups.length; i++){
        if($scope.userGroups[i]._id == group._id){
          for (var j = 0; j < $scope.userGroups[i].contextPacks.length; j++){
            if ($scope.userGroups[i].contextPacks[j] == $scope.useCategory._id){
              $scope.userGroups[i].contextPacks.splice(j, 1);
            }
          }
        }
      }
      $http.patch('/api/users/'+$scope.currentUser._id+'/group',
        {groupList: $scope.userGroups}).success(function(){
          $scope.getAll();
        });
      $scope.displayCatInfo($scope.useCategory);
    };

    $scope.unassignStudentFromCategory = function (student, category, view){
      $scope.confirmUnassign(student.firstName, category);
      $scope.getRealCategory(category);
      for (var i = 0; i < $scope.userStudents.length; i++){
        if($scope.userStudents[i]._id == student._id){
          for (var j = 0; j < $scope.userStudents[i].contextTags.length; j++){
            if($scope.userStudents[i].contextTags[j].tagName == $scope.useCategory._id){
              console.log("got here");
              $scope.userStudents[i].contextTags.splice(j,1);
              $http.patch('/api/students/'+student._id,
                {contextTags: $scope.userStudents[i].contextTags}).success(function(){
                  $scope.getAll();
                });
              if (view == "category"){
                $scope.displayCatInfo($scope.useCategory);
              } else {
                $scope.displayStudentInfo(student);
              }
            }
          }
        }
      }
    };

//Tile view unassign functions

    $scope.unassignWordFromCategory = function (word, category){
      $scope.confirmUnassign(word.name, category);
      //Tile API remove from context tags [{tagName:id}]
      for(var z = 0; z < $scope.userCategories.length; z ++){
        if ($scope.userCategories[z].name == category){
          $scope.useCategory = $scope.userCategories[z];
        }
      }
      for(var i = 0; i < $scope.userTiles.length; i++){
        if($scope.userTiles[i]._id == word._id){
          for (var j = 0; j < $scope.userTiles[i].contextTags.length; j++){
            if($scope.useCategory._id == $scope.userTiles[i].contextTags[j].tagName){
              $scope.userTiles[i].contextTags.splice(j,1);
              $http.patch('/api/tile/'+word._id,
                {contextTags: $scope.userTiles[i].contextTags}).success(function(){
                  $scope.getAll();
                });
              $scope.displayCatInfo($scope.useCategory);
            }
          }
        }
      }
    };

    $scope.unassignWordFromGroup = function (group, word){
      $scope.confirmUnassign(group, word);
    };

    $scope.unassignWordFromStudent = function (student, word){
      $scope.confirmUnassign(student.firstName, word);
    };

//Group view unassign functions
    $scope.unassignStudentFromGroup = function (student, group){
      $scope.confirmUnassign(student.firstName, group);
    };

    $scope.unassignCategoryFromGroup = function(category, group){

    };

    $scope.unassignTileFromGroup = function (tile, group){
      $scope.confirmUnassign(tile.name, group);
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
        console.log($scope.selectedWords[0])
      } else if (!$scope.groupView && $scope.categoryView){
        //Function to add selected categories to selected students.
      } else if (!$scope.groupView && !$scope.categoryView){
        //Function to add selected words to selected students.
      }
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
      $scope.groupedStudents=[];
      for(var i = 0; i < $scope.studentArray.length; i++){
        console.log($scope.studentArray[i].groupList.indexOf(group));
        console.log(group.groupName);
        if ($scope.studentArray[i].groupList.indexOf(group.groupName) > -1) {
          console.log("we are in the if statement");
          $scope.groupedStudents.push($scope.studentArray[i]);

        }
      }
      console.log($scope.groupedStudents);
    };

//$scope.groupedStudents = [];

  });
