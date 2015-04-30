'use strict';

//var jquery = require('./../../bower_components/jquery/src/jquery.js');

angular.module('WordRiverApp')
  .controller('AssignWordsCtrl', function ($rootScope, $scope, $http, socket, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.categoryArray = [];
    $scope.groupArray = [];
    $scope.studentArray = [];
    $scope.allStudents = [];
    $scope.matchTiles = [];
    $scope.userTiles = [];
    $scope.studentCategories = [];
    $scope.groupedStudents = [];
    $scope.value = false;
    $scope.help = false;
    $scope.displayTiles = [];

    $scope.selectedCategories = [];
    $scope.selectedGroups = [];
    $scope.selectedStudents = [];
    $scope.selectedWords = [];

    $scope.helpText = "Get Help";

    ////////////////////////////////////////////////////////////////////////////
    //This is the section for getting all the things

    $scope.getAll = function () {
      $scope.userTiles = [];
      $scope.userCategories = [];
      $scope.userStudents = [];
      $scope.userGroups = [];
      //$scope.isCollapsed = false;
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
        $scope.help = false;
      } else if (section == "word"){
        $scope.showCategory = false;
        $scope.wordView = true;
        $scope.studentView = false;
        $scope.showGroup = false;
        $scope.showMiddle = true;
        $scope.help = false;
      } else if (section == "student"){
        $scope.showCategory = false;
        $scope.wordView = false;
        $scope.studentView = true;
        $scope.showGroup = false;
        $scope.showMiddle = true;
        $scope.help = false;
      } else if (section == "group"){
        $scope.showCategory = false;
        $scope.wordView = false;
        $scope.studentView = false;
        $scope.showGroup = true;
        $scope.showMiddle = true;
        $scope.help = false;
      } else if (section == "middle"){
        $scope.showCategory = false;
        $scope.wordView = false;
        $scope.studentView = false;
        $scope.showGroup = false;
        $scope.showMiddle = false;
        $scope.help = false;
      }
      $scope.middleText = section;
    };

    $scope.toggleHelp = function(){
      if ($scope.help){
        $scope.helpText= "Get Help";
      }
      else {
        $scope.helpText = "Hide Help";
      }
      $scope.help = !$scope.help;
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

    $scope.uncheckAll = function () {
      var checkboxes = [];
      checkboxes = document.getElementsByTagName('input');

      for (var i=0; i<checkboxes.length; i++)  {
        if (checkboxes[i].type == 'checkbox')   {
          checkboxes[i].checked = false;
        }
      }
    };

    ////////////////////////////////////////////////////////////////////////////
    //This is the section for switching information in the middle

    //cat is short for category
    $scope.displayCatInfo = function (category) {
      $scope.switchMiddle("category");
      $scope.categorySelected = category;
      $scope.matchStudent = [];
      $scope.matchGroup = [];
      $scope.matchTiles = [];
      for (var j = 0; j < $scope.userTiles.length; j++) {
        for (var z = 0; z < $scope.userTiles[j].contextTags.length; z++) {
          if ($scope.userTiles[j].contextTags[z] == category._id) {
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
      $scope.groupSelected = group;
      $scope.matchCategoryIds = [];
      $scope.matchCategories = [];
      $scope.matchStudents = [];
      $scope.matchTiles = [];
      $scope.matchTileIds = [];
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
        if ($scope.userGroups[m]._id == group._id){
          for(var p = 0; p < $scope.userGroups[m].freeTiles.length; p++) {
            $scope.matchTileIds.push($scope.userGroups[m].freeTiles[p]);
          }
        }
      }
      for (var h = 0; h < $scope.matchTileIds.length; h++){
        for (var o = 0; o < $scope.userTiles.length; o++){
          if ($scope.matchTileIds[h] == $scope.userTiles[o]._id){
            $scope.matchTiles.push($scope.userTiles[o]);
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
      //Go through students to find the selected one and get category and tile ids
      for (var j = 0; j < $scope.userStudents.length; j++) {
        if ($scope.userStudents[j]._id == student._id) {
          $scope.matchCategoryIds = $scope.userStudents[j].contextTags;
          $scope.matchTileIds = $scope.userStudents[j].tileBucket;
          $scope.matchGroupIds = $scope.userStudents[j].groupList;
        }
      }
      //Go through user tiles to find matches with the ids stored in the student
      for (var k = 0; k < $scope.matchTileIds.length; k++){
        for (var l = 0; l < $scope.userTiles.length; l++){
          if ($scope.userTiles[l]._id == $scope.matchTileIds[k]){
            $scope.matchTiles.push($scope.userTiles[l]);
          }
        }
      }
      //Go through user groups and find matches with group ids stored in student
      for (var b = 0; b < $scope.matchGroupIds.length; b++){
        for (var v = 0; v < $scope.userGroups.length; v++){
          if ($scope.userGroups[v]._id == $scope.matchGroupIds[b]){
            $scope.matchGroups.push($scope.userGroups[v]);
          }
        }
      }
      //Go through user categories and find matches with category ids stored in student
      for (var q = 0; q < $scope.matchCategoryIds.length; q++){
        for (var r = 0; r < $scope.currentUser.contextPacks.length; r++){
          if ($scope.currentUser.contextPacks[r] == $scope.matchCategoryIds[q]){
            $scope.matchCategories.push($scope.userCategories[r]);
          }
        }
      }
    };

    $scope.displayTileInfo = function (word) {
      $scope.tileSelected = word;
      $scope.switchMiddle("word");
      $scope.matchCategoryIds = [];
      $scope.matchCategories = [];
      $scope.matchGroup = [];
      $scope.matchStudent = [];
      //Finds the word in the userTiles array and gets the contextTag ids
      for (var i = 0; i < $scope.userTiles.length; i++) {
        if ($scope.userTiles[i]._id == word._id) {
          for (var j = 0; j < $scope.userTiles[i].contextTags.length; j++) {
            $scope.matchCategoryIds.push($scope.userTiles[i].contextTags[j]);
          }
        }
      }
      //Magically turns category ids into actual categories
      for (var q = 0; q < $scope.matchCategoryIds.length; q++) {
        for (var r = 0; r < $scope.userCategories.length; r++) {
          if ($scope.userCategories[r]._id == $scope.matchCategoryIds[q]) {
            $scope.matchCategories.push($scope.userCategories[r]);
          }
        }
      }
      //Finds the groups that have the word stored as a free tile
      for (var l = 0; l < $scope.userGroups.length; l++) {
        for (var m = 0; m < $scope.userGroups[l].freeTiles.length; m++) {
          if ($scope.userGroups[l].freeTiles[m] == word._id) {
            $scope.matchGroup.push($scope.userGroups[l]);
          }
        }
      }
      //Finds the students that have the word stored in their tile buckets
      for (var o = 0; o < $scope.userStudents.length; o++) {
        for (var p = 0; p < $scope.userStudents[o].tileBucket.length; p++) {
          if (word._id == $scope.userStudents[o].tileBucket[p]) {
            $scope.matchStudent.push($scope.userStudents[o]);
          }
        }
      }
    };

////////////////////////////////////////////////////////////////////////////
//This is the section for the unassign functions

    $scope.unassignTileFromCategory = function (word, category, view){
      if($scope.confirmUnassign(word.name, category.name)==true) {
        //Tile API remove from context tags [{tagName:id}]
        for (var i = 0; i < $scope.userTiles.length; i++) {
          if ($scope.userTiles[i]._id == word._id) {
            for (var j = 0; j < $scope.userTiles[i].contextTags.length; j++) {
              if (category._id == $scope.userTiles[i].contextTags[j]) {
                $scope.userTiles[i].contextTags.splice(j, 1);
                $scope.i = i;
                $http.patch('/api/tile/' + word._id,
                  {contextTags: $scope.userTiles[i].contextTags}).success(function () {
                    $scope.getAll();
                  });
                if (view == 'category') {
                  $scope.displayCatInfo(category);
                } else {
                  $scope.displayTileInfo(word);
                }
              }
            }
          }
        }
      }
    };

    $scope.unassignGroupFromCategory = function (group, category, view){
      if($scope.confirmUnassign(group.groupName, category.name)==true) {
        for (var i = 0; i < $scope.userGroups.length; i++) {
          if ($scope.userGroups[i]._id == group._id) {
            for (var j = 0; j < $scope.userGroups[i].contextPacks.length; j++) {
              if ($scope.userGroups[i].contextPacks[j] == category._id) {
                $scope.userGroups[i].contextPacks.splice(j, 1);
              }
            }
          }
        }
        $http.patch('/api/users/' + $scope.currentUser._id + '/group',
          {groupList: $scope.userGroups}).success(function () {
            $scope.getAll();
          });
        if (view == 'category') {
          $scope.displayCatInfo(category);
        } else {
          $scope.displayGroupInfo(group);
        }
      }
    };

    $scope.unassignStudentFromCategory = function (student, category, view){
      if($scope.confirmUnassign(student.firstName, category.name)==true) {
        for (var i = 0; i < $scope.userStudents.length; i++) {
          if ($scope.userStudents[i]._id == student._id) {
            for (var j = 0; j < $scope.userStudents[i].contextTags.length; j++) {
              if ($scope.userStudents[i].contextTags[j] == category._id) {
                $scope.userStudents[i].contextTags.splice(j, 1);
                $http.patch('/api/students/' + student._id,
                  {contextTags: $scope.userStudents[i].contextTags}).success(function () {
                    $scope.getAll();
                  });
                if (view == "category") {
                  $scope.displayCatInfo(category);
                } else {
                  $scope.displayStudentInfo(student);
                }
              }
            }
          }
        }
      }
    };

    $scope.unassignWordFromGroup = function (group, word, type){
      if($scope.confirmUnassign(group.groupName, word.name)==true) {
        for (var i = 0; i < $scope.userGroups.length; i++) {
          if ($scope.userGroups[i] == group) {
            for (var j = 0; j < $scope.userGroups[i].freeTiles[j].length; j++) {
              if ($scope.userGroups[i].freeTiles[j] == word._id) {
                $scope.userGroups[i].freeTiles.splice(j, 1);
                $http.patch('/api/users/' + $scope.currentUser._id + '/group',
                  {groupList: $scope.userGroups}).success(function () {
                    $scope.getAll();
                  });
                if (type == 'group') {
                  $scope.displayGroupInfo(group);
                } else {
                  $scope.displayTileInfo(word);
                }
              }
            }
          }
        }
      }
    };

    $scope.unassignWordFromStudent = function (student, word, type){
      if ($scope.confirmUnassign(student.firstName, word.name)==true) {
        for (var i = 0; i < $scope.userStudents.length; i++) {
          if ($scope.userStudents[i]._id == student._id) {
            for (var j = 0; j < $scope.userStudents[i].tileBucket.length; j++) {
              if ($scope.userStudents[i].tileBucket[j] == word._id) {
                $scope.userStudents[i].tileBucket.splice(j, 1);
                $http.patch('api/students/' + student._id,
                  {tileBucket: $scope.userStudents[i].tileBucket}).success(function () {
                    $scope.getAll();
                  });
                if (type == 'tile') {
                  $scope.displayTileInfo(word);
                } else {
                  $scope.displayStudentInfo(student);
                }
              }
            }
          }
        }
      }
    };

    $scope.unassignStudentFromGroup = function (student, group, type){
      if ($scope.confirmUnassign(student.firstName, group.groupName) == true) {
        for (var i = 0; i < $scope.userStudents.length; i++) {
          if ($scope.userStudents[i]._id == student._id) {
            for (var j = 0; j < $scope.userStudents[i].groupList.length; j++) {
              if ($scope.userStudents[i].groupList[j] == group._id) {
                $scope.userStudents[i].groupList.splice(j, 1);
                $http.patch('api/students/' + student._id,
                  {groupList: $scope.userStudents[i].groupList}).success(function () {
                    $scope.getAll();
                  });
                if (type == 'student') {
                  $scope.displayStudentInfo(student);
                } else {
                  $scope.displayGroupInfo(group);
                }
              }
            }
          }
        }
      }
    };


    $scope.confirmUnassign = function (thing, place){
      return confirm("Are you sure that you would like to unassign " + thing + " from "+ place + "?")
    };

////////////////////////////////////////////////////////////////////////////
//This is the section for the assign function and its helpers

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

    $scope.assignWords = function (view) {
      $scope.success = false;
      if ($scope.groupView && $scope.categoryView) {
        //Function to add selected categories to selected groups.
        if ($scope.selectedGroups.length == 0) {
          alert("You must select at least 1 group.");
        }
        else if ($scope.selectedCategories.length == 0) {
          alert("You must select at least 1 category.");
        }
        else {
          for (var a = 0; a < $scope.userGroups.length; a++) {
            for (var b = 0; b < $scope.selectedGroups.length; b++) {
              if ($scope.userGroups[a]._id == $scope.selectedGroups[b]._id) {
                for (var c = 0; c < $scope.selectedCategories.length; c++) {
                  $scope.userGroups[a].contextPacks.push($scope.selectedCategories[c]._id);
                }
                $scope.userGroups[a].contextPacks = $scope.checkForDuplicates($scope.userGroups[a].contextPacks);
              }
            }
          }
          $http.patch('api/users/' + $scope.currentUser._id + '/group',
            {groupList: $scope.userGroups}).success(function () {
              alert("Successfully assigned!");
              $scope.getAll();
            });
          $scope.success = true;
        }

      } else if ($scope.groupView && !$scope.categoryView) {
        //Function to add selected words to selected groups.
        if ($scope.selectedGroups.length == 0) {
          alert("You must select at least 1 group.");
        }
        else if ($scope.selectedWords.length == 0) {
          alert("You must select at least 1 word.");
        }
        else {
          for (var d = 0; d < $scope.userGroups.length; d++) {
            for (var e = 0; e < $scope.selectedGroups.length; e++) {
              if ($scope.userGroups[d]._id == $scope.selectedGroups[e]._id) {
                for (var f = 0; f < $scope.selectedWords.length; f++) {
                  $scope.userGroups[d].freeTiles.push($scope.selectedWords[f]._id);
                }
                $scope.userGroups[d].freeTiles = $scope.checkForDuplicates($scope.userGroups[d].freeTiles);
              }
            }
          }
          $http.patch('api/users/' + $scope.currentUser._id + '/group',
            {groupList: $scope.userGroups}).success(function () {
              alert("Successfully assigned!");
              $scope.getAll();
            });
          $scope.success = true;
        }
      } else if (!$scope.groupView && $scope.categoryView) {
        //Function to add selected categories to selected students.
        if ($scope.selectedStudents.length == 0) {
          alert("You must select at least 1 student.");
        }
        if ($scope.selectedCategories.length == 0) {
          alert("You must select at least 1 category.");
        }
        for (var g = 0; g < $scope.userStudents.length; g++) {
          for (var w = 0; w < $scope.selectedStudents.length; w++) {
            if ($scope.userStudents[g]._id == $scope.selectedStudents[w]._id) {
              for (var n = 0; n < $scope.selectedCategories.length; n++) {
                $scope.userStudents[g].contextTags.push($scope.selectedCategories[n]._id);
              }
              $scope.userStudents[g].contextTags = $scope.checkForDuplicates($scope.userStudents[g].contextTags);
              $http.patch('api/students/' + $scope.userStudents[g]._id,
                {contextTags: $scope.userStudents[g].contextTags}).success(function () {
                  alert("Successfully assigned!");
                  $scope.getAll();
                });
            }
          }
        }
        $scope.success = true;
      } else if (!$scope.groupView && !$scope.categoryView){
        //Function to add selected words to selected students.
        if($scope.selectedStudents.length == 0){
          alert("You must select at least 1 student.");
        }
        if($scope.selectedWords.length == 0){
          alert("You must select at least 1 word.");
        }
        for (var r = 0; r < $scope.userStudents.length; r++) {
          for (var y = 0; y < $scope.selectedStudents.length; y++) {
            if ($scope.userStudents[r]._id == $scope.selectedStudents[y]._id) {
              for (var v = 0; v < $scope.selectedWords.length; v++) {
                $scope.userStudents[r].tileBucket.push($scope.selectedWords[v]._id);
              }
              $scope.userStudents[r].tileBucket = $scope.checkForDuplicates($scope.userStudents[r].tileBucket);
              $http.patch('api/students/' + $scope.userStudents[r]._id,
                {tileBucket: $scope.userStudents[r].tileBucket}).success(function () {
                  $scope.getAll();
                  alert("Successfully assigned!");
                });
            }
          }
        }
        $scope.success = true;
      }
      if ($scope.success) {
        $scope.selectedCategories = [];
        $scope.selectedWords = [];
        $scope.selectedGroups = [];
        $scope.selectedStudents = [];
        $scope.uncheckAll();
      }
      $scope.switchMiddle("middle");
    };


//getting the list of students within a group to show for collapsibility purposes in the assign content to people page

    $scope.studentsInGroupAssignment = function(group) {
      $scope.groupedStudents = [];
      for (var i = 0; i < $scope.userStudents.length; i++) {
        if ($scope.userStudents[i].groupList.indexOf(group._id) > -1) {
          console.log("we are in the if statement");
          $scope.groupedStudents.push($scope.userStudents[i]);
        }
      }
      console.log($scope.groupedStudents);
    };

    //$scope.oneAtATime = true;

    $scope.openingOnlyOneGroup = function(group){
      for(var i = 0; i < $scope.userGroups.length; i++){

        console.log($scope.userGroups[i]);

        if($scope.userGroups[i]._id == group._id){
          $scope.userGroups[i].isCollapsed = !$scope.userGroups[i].isCollapsed;
          console.log("if statement");
        }
        else{
          $scope.userGroups[i].isCollapsed = true;
          console.log("else statement");
        }
      }

    };

    $scope.populateDisplayTile = function(category){
      $scope.displayTiles = [];
      console.log(category.isColl);
      for (var j = 0; j < $scope.userTiles.length; j++) {
        for (var z = 0; z < $scope.userTiles[j].contextTags.length; z++) {
          if ($scope.userTiles[j].contextTags[z] == category._id) {
            $scope.displayTiles.push($scope.userTiles[j]);
          }
        }
      }
    };

    $scope.openingOnlyOneCategory = function(category){
      for(var i = 0; i < $scope.userCategories.length; i++){

        console.log($scope.userCategories[i]);

        if($scope.userCategories[i]._id == category._id){
          $scope.userCategories[i].isCollapsed = !$scope.userCategories[i].isCollapsed;
          console.log("if statement");
        }
        else{
          $scope.userCategories[i].isCollapsed = true;
          console.log("else statement");
        }
      }

    };


  });
