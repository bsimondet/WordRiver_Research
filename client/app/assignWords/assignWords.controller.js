'use strict';

//var jquery = require('./../../bower_components/jquery/src/jquery.js');

angular.module('WordRiverApp')
  .controller('AssignWordsCtrl', function ($rootScope, $scope, $http, socket, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.categoryArray = [];
    $scope.userClasses = [];
    $scope.userWordPacks = [];
    $scope.studentArray = [];
    $scope.allStudents = [];
    $scope.matchWords = [];
    $scope.allWords = [];
    $scope.studentWordPacks = [];
    $scope.studentsInClass = [];
    $scope.value = false;
    $scope.help = false;
    $scope.displayTiles = [];

    $scope.selectedCategories = [];
    $scope.selectedClasses = [];
    $scope.selectedStudents = [];
    $scope.selectedWords = [];

    $scope.helpText = "Get Help";



    ////////////////////////////////////////////////////////////////////////////
    //This is the section for getting all the things

    $scope.getWords = function(){
      $scope.allWords = [];
      $http.get('/api/tile').success(function(tiles) {
        $scope.allWords = tiles;
      });
    };

    $scope.getClasses = function(){
      $scope.userClasses = [];
      $http.get("/api/users/me").success(function(user){
        $scope.userClasses = user.classList;
      })
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
    };

    $scope.getWordPacks = function(){
      $http.get('/api/categories/' + $scope.currentUser._id + '/categories').success(function(wordPacks){
        $scope.userWordPacks = wordPacks;
      });
    };

    $scope.getWords();
    $scope.getClasses();
    $scope.getStudents();
    $scope.getWordPacks();


    $scope.getAll = function () {
      $scope.getWords();
      $scope.getClasses();
      $scope.getStudents();
      $scope.getWordPacks();
    };

    $scope.inArray= function(array, item){
      for(var i = 0; i < array.length; i++){
        if(array[i] == item){
          return true;
        }
      }
      return false;
    };

    ////////////////////////////////////////////////////////////////////////////
    //This is the section for switching views

    $scope.classView = true;
    $scope.categoryView = true;


    $scope.showMiddle = false;
    $scope.wordView = false;
    $scope.studentView = false;
    $scope.showClass = false;
    $scope.showCategory = false;

    $scope.switchMiddle = function(section){
      if(section == "category"){
        $scope.showCategory = true;
        $scope.wordView = false;
        $scope.studentView = false;
        $scope.showClass = false;
        $scope.showMiddle = true;
        $scope.help = false;
      } else if (section == "word"){
        $scope.showCategory = false;
        $scope.wordView = true;
        $scope.studentView = false;
        $scope.showClass = false;
        $scope.showMiddle = true;
        $scope.help = false;
      } else if (section == "student"){
        $scope.showCategory = false;
        $scope.wordView = false;
        $scope.studentView = true;
        $scope.showClass = false;
        $scope.showMiddle = true;
        $scope.help = false;
      } else if (section == "class"){
        $scope.showCategory = false;
        $scope.wordView = false;
        $scope.studentView = false;
        $scope.showClass = true;
        $scope.showMiddle = true;
        $scope.help = false;
      } else if (section == "middle"){
        $scope.showCategory = false;
        $scope.wordView = false;
        $scope.studentView = false;
        $scope.showClass = false;
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
      var counter = 0;
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

    $scope.checkClasses = function (myClass) {
      var counter = 0;
      for (var i = 0; i < $scope.selectedClasses.length; i++) {
        if ($scope.selectedClasses[i] == myClass) {
          $scope.selectedClasses.splice(i, 1);
          counter = 1;
        }
      }
      if (counter != 1) {
        $scope.selectedClasses.push(myClass);
      }
    };

    $scope.checkStudents = function (student) {
      var counter = 0;
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
     var checkboxes = document.getElementsByTagName('input');

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
      $scope.middleElement = category;
      $scope.matchStudent = [];
      $scope.matchGroup = [];
      $scope.matchWords = [];
      for (var j = 0; j < $scope.allWords.length; j++) {
        for (var z = 0; z < $scope.allWords[j].contextTags.length; z++) {
          if ($scope.allWords[j].contextTags[z] == category._id) {
            $scope.matchWords.push($scope.allWords[j]);
          }
        }
      }
      for (var i=0; i<$scope.userClasses.length; i++){
        for (var m=0; m<$scope.userClasses[i].contextPacks.length; m++){
          if($scope.userClasses[i].contextPacks[m] == category._id){
            $scope.matchGroup.push($scope.userClasses[i]);
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

    $scope.displayClassInfo = function (myClass){
      $scope.switchMiddle("class");
      $scope.classSelected = myClass;
      $scope.middleElement = myClass;
      $scope.matchWordPackIDs = [];
      $scope.matchWordPacks = [];
      $scope.matchStudents = [];
      $scope.matchWords = [];
      $scope.matchWordIDs = [];
      for(var i = 0; i<$scope.userClasses.length; i++){
        if ($scope.userClasses[i]._id == myClass._id){
          for(var j = 0; j < $scope.userClasses[i].groupList.length; j++){
            for(var q = 0; q < $scope.userClasses[i].groupList[j].contextPacks.length; q++){
                $scope.matchWordPackIDs.push($scope.userClasses[i].groupList[j].contextPacks[q]);
            }
          }
        }
      }
      for(var z = 0; z < $scope.matchWordPackIDs.length; z++){
        for(var v = 0; v < $scope.userWordPacks.length; v++){
          if($scope.matchWordPackIDs[z] == $scope.userWordPacks[v]._id){
            $scope.matchWordPacks.push($scope.userWordPacks[v]);
          }
        }
      }
      for (var k = 0; k < $scope.userStudents.length; k++){
        for (var l = 0; l < $scope.userStudents[k].classList.length; l++){
          if ($scope.userStudents[k].classList[l]._id == myClass._id){
            $scope.matchStudents.push($scope.userStudents[k]);
          }
        }
      }
      for (var m = 0; m < $scope.userClasses.length; m++) {
        if ($scope.userClasses[m]._id == myClass._id) {
          for (var p = 0; p < $scope.userClasses[m].groupList.length; p++) {
            for(var a = 0; a < $scope.userClasses[m].groupList[p].freeTiles.length; a++) {
              $scope.matchWordIDs.push($scope.userClasses[m].groupList[p].freeTiles[a]);
            }
          }
        }
      }
      for (var h = 0; h < $scope.matchWordIDs.length; h++){
        for (var o = 0; o < $scope.allWords.length; o++){
          if ($scope.matchWordIDs[h] == $scope.allWords[o]._id){
            $scope.matchWords.push($scope.allWords[o]);
          }
        }
      }
    };

    $scope.displayStudentInfo = function (student){
      $scope.studentSelected = student;
      $scope.switchMiddle("student");
      $scope.matchClasses = [];
      $scope.middleElement = student;
      $scope.studentWordPacks = [];
      $scope.matchWords = [];
      $scope.matchWordIDs = [];
      $scope.matchClasses = [];
      $scope.matchWordPackIDs = [];
      $scope.matchWordPacks = [];
      //Go through students to find the selected one and get category and tile ids
      for (var j = 0; j < $scope.userStudents.length; j++) {
        if ($scope.userStudents[j]._id == student._id) {
          $scope.matchWordPackIDs = $scope.userStudents[j].contextTags;
          $scope.matchWordIDs = $scope.userStudents[j].tileBucket;
          for(var index = 0; index < $scope.userStudents[j].classList.length; index++){
            $scope.matchClasses.push($scope.userStudents[j].classList[index]);
          }
        }
      }
      //Go through user words to find matches with the ids stored in the student
      for (var k = 0; k < $scope.matchWordIDs.length; k++){
        for (var l = 0; l < $scope.allWords.length; l++){
          if ($scope.allWords[l]._id == $scope.matchWordIDs[k]){
            $scope.matchWords.push($scope.allWords[l]);
          }
        }
      }
      //Go through user classes and find matches with class ids stored in student
      for (var b = 0; b < $scope.matchClasses.length; b++){
        for (var v = 0; v < $scope.userClasses.length; v++){
          if ($scope.userClasses[v]._id == $scope.matchClasses[b]._id){
            $scope.matchClasses.push($scope.userClasses[v]);
          }
        }
      }
      //Go through user categories and find matches with category ids stored in student
      for (var q = 0; q < $scope.matchWordPackIDs.length; q++){
        for (var r = 0; r < $scope.currentUser.contextPacks.length; r++){
          if ($scope.currentUser.contextPacks[r] == $scope.matchWordPackIDs[q]){
            $scope.matchWordPacks.push($scope.userWordPacks[r]);
          }
        }
      }
    };

    $scope.displayTileInfo = function (word) {
      $scope.tileSelected = word;
      $scope.switchMiddle("word");
      $scope.middleElement = word;
      $scope.matchWordPackIDs = [];
      $scope.matchWordPacks = [];
      $scope.matchGroup = [];
      $scope.matchStudent = [];
      //Finds the word in the allWords array and gets the contextTag ids
      for (var i = 0; i < $scope.allWords.length; i++) {
        if ($scope.allWords[i]._id == word._id) {
          for (var j = 0; j < $scope.allWords[i].contextTags.length; j++) {
            $scope.matchWordPackIDs.push($scope.allWords[i].contextTags[j]);
          }
        }
      }
      //Magically turns category ids into actual categories
      for (var q = 0; q < $scope.matchWordPackIDs.length; q++) {
        for (var r = 0; r < $scope.userWordPacks.length; r++) {
          if ($scope.userWordPacks[r]._id == $scope.matchWordPackIDs[q]) {
            $scope.matchWordPacks.push($scope.userWordPacks[r]);
          }
        }
      }
      //Finds the groups that have the word stored as a free tile
      for (var l = 0; l < $scope.userClasses.length; l++) {
        for (var m = 0; m < $scope.userClasses[l].freeTiles.length; m++) {
          if ($scope.userClasses[l].freeTiles[m] == word._id) {
            $scope.matchGroup.push($scope.userClasses[l]);
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
        for (var i = 0; i < $scope.allWords.length; i++) {
          if ($scope.allWords[i]._id == word._id) {
            for (var j = 0; j < $scope.allWords[i].contextTags.length; j++) {
              if (category._id == $scope.allWords[i].contextTags[j]) {
                $scope.allWords[i].contextTags.splice(j, 1);
                $scope.i = i;
                $http.patch('/api/tile/' + word._id,
                  {contextTags: $scope.allWords[i].contextTags}).success(function () {
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
        for (var i = 0; i < $scope.userClasses.length; i++) {
          if ($scope.userClasses[i]._id == group._id) {
            for (var j = 0; j < $scope.userClasses[i].contextPacks.length; j++) {
              if ($scope.userClasses[i].contextPacks[j] == category._id) {
                $scope.userClasses[i].contextPacks.splice(j, 1);
              }
            }
          }
        }
        $http.patch('/api/users/' + $scope.currentUser._id + '/group',
          {groupList: $scope.userClasses}).success(function () {
            $scope.getAll();
          });
        if (view == 'category') {
          $scope.displayCatInfo(category);
        } else {
          $scope.displayClassInfo(group);
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
        for (var i = 0; i < $scope.userClasses.length; i++) {
          if ($scope.userClasses[i] == group) {
            for (var j = 0; j < $scope.userClasses[i].freeTiles[j].length; j++) {
              if ($scope.userClasses[i].freeTiles[j] == word._id) {
                $scope.userClasses[i].freeTiles.splice(j, 1);
                $http.patch('/api/users/' + $scope.currentUser._id + '/group',
                  {groupList: $scope.userClasses}).success(function () {
                    $scope.getAll();
                  });
                if (type == 'group') {
                  $scope.displayClassInfo(group);
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
                  $scope.displayClassInfo(group);
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
      if ($scope.classView && $scope.categoryView) {
        //Function to add selected categories to selected groups.
        if ($scope.selectedClasses.length == 0) {
          alert("You must select at least 1 group.");
        }
        else if ($scope.selectedCategories.length == 0) {
          alert("You must select at least 1 category.");
        }
        else {
          for (var a = 0; a < $scope.userClasses.length; a++) {
            for (var b = 0; b < $scope.selectedClasses.length; b++) {
              if ($scope.userClasses[a]._id == $scope.selectedClasses[b]._id) {
                for (var c = 0; c < $scope.selectedCategories.length; c++) {
                  $scope.userClasses[a].contextPacks.push($scope.selectedCategories[c]._id);
                }
                $scope.userClasses[a].contextPacks = $scope.checkForDuplicates($scope.userClasses[a].contextPacks);
              }
            }
          }
          $http.patch('api/users/' + $scope.currentUser._id + '/group',
            {groupList: $scope.userClasses}).success(function () {
              $scope.getAll();
            });
          $scope.success = true;
        }

      } else if ($scope.classView && !$scope.categoryView) {
        //Function to add selected words to selected groups.
        if ($scope.selectedClasses.length == 0) {
          alert("You must select at least 1 group.");
        }
        else if ($scope.selectedWords.length == 0) {
          alert("You must select at least 1 word.");
        }
        else {
          for (var d = 0; d < $scope.userClasses.length; d++) {
            for (var e = 0; e < $scope.selectedClasses.length; e++) {
              if ($scope.userClasses[d]._id == $scope.selectedClasses[e]._id) {
                for (var f = 0; f < $scope.selectedWords.length; f++) {
                  $scope.userClasses[d].freeTiles.push($scope.selectedWords[f]._id);
                }
                $scope.userClasses[d].freeTiles = $scope.checkForDuplicates($scope.userClasses[d].freeTiles);
              }
            }
          }
          $http.patch('api/users/' + $scope.currentUser._id + '/group',
            {groupList: $scope.userClasses}).success(function () {
              $scope.getAll();
            });
          $scope.success = true;
        }
      } else if (!$scope.classView && $scope.categoryView) {
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
                  $scope.getAll();
                });
            }
          }
        }
        $scope.success = true;
      } else if (!$scope.classView && !$scope.categoryView){
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
                });
            }
          }
        }
        alert("Successfully assigned!");
        $scope.success = true;
      }
      if ($scope.success) {
        $scope.getNewInfo();
        $scope.selectedCategories = [];
        $scope.selectedWords = [];
        $scope.selectedClasses = [];
        $scope.selectedStudents = [];
        $scope.uncheckAll();
      }
    };

    //Refreshes the page
$scope.getNewInfo = function() {
  if($scope.showClass){
    $scope.displayClassInfo($scope.classSelected);
  }else if($scope.showCategory){
    $scope.displayCatInfo($scope.categorySelected);
  }
};

//getting the list of students within a group to show for collapsibility purposes in the assign content to people page
//TODO: Need to look at the collapse function if desired still.
    $scope.studentsInClassAssignment = function(myClass) {
      $scope.studentsInClass = [];
      for (var i = 0; i < $scope.userStudents.length; i++) {
        for (var j = 0; j < $scope.userStudents[i].classList.length; j++) {
          if ($scope.userStudents[i].classList[j]._id == myClass._id) {
            $scope.studentsInClass.push($scope.userStudents[i]);
          }
        }
      }
    };

    $scope.openingOnlyOneClass = function(myClass){
      for(var i = 0; i < $scope.userClasses.length; i++){
        console.log($scope.userClasses[i]);
        if($scope.userClasses[i]._id == myClass._id){
          $scope.userClasses[i].isCollapsed = !$scope.userClasses[i].isCollapsed;
        } else {
          //$scope.userClasses[i].isCollapsed = true;
          console.log("else statement");
        }
      }

    };

    $scope.populateDisplayTile = function(category){
      $scope.displayTiles = [];
      for (var j = 0; j < $scope.allWords.length; j++) {
        for (var z = 0; z < $scope.allWords[j].contextTags.length; z++) {
          if ($scope.allWords[j].contextTags[z] == category._id) {
            $scope.displayTiles.push($scope.allWords[j]);
          }
        }
      }
    };

    $scope.openingOnlyOneCategory = function(category){
      for(var i = 0; i < $scope.userWordPacks.length; i++){

        console.log($scope.userWordPacks[i]);

        if($scope.userWordPacks[i]._id == category._id){
          $scope.userWordPacks[i].isCollapsed = !$scope.userWordPacks[i].isCollapsed;
          console.log("if statement");
        }
        else{
          $scope.userWordPacks[i].isCollapsed = true;
          console.log("else statement");
        }
      }

    };

    $scope.fullNameBoolean = true;

    $scope.fullName = function() {
      if ($scope.fullNameBoolean) {
        for (var i = 0; i < $scope.userStudents.length; i++) {
          $scope.userStudents[i].fullName = $scope.userStudents[i].firstName + $scope.userStudents[i].lastName;
          $scope.fullNameBoolean = false;
        }
      }
    };

  });
