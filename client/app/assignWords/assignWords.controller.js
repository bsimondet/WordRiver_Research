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
    $scope.categoryView = true;

    $scope.showGroupView = function(bool){
      $scope.groupView = bool;
    };

    $scope.showCategoryView = function(bool){
      $scope.categoryView = bool;
    };

    $scope.getAll = function () {
      $scope.categoryArray = [];
      $scope.groupArray = [];
      $scope.selectedStudents = [];
      $scope.studentArray = [];
      $scope.categoryArray = $scope.currentUser.contextPacks;
      $scope.groupArray = $scope.currentUser.groupList;
      $scope.studentArray = $scope.currentUser.studentList;
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
      for(var i = 0; i < 30; i++){
        $scope.categoryArray.push(i)
      }
    };
    $scope.getAll();


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

    //cat is short for category
    $scope.displayCatInfo = function (category) {
      $scope.userTiles = [];
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

      if($scope.matchTiles.length > 0) {
        alert("The tiles in the category " + category + " are:\n" + $scope.matchTiles.join('\n'));
      } else {
        alert("There are no tiles in this category");
      }
      });
    };

    $scope.displayGroupInfo = function (group){
      for(var i =0; i<$scope.groupArray.length; i++){
        if($scope.groupArray[i].groupName == group){
          alert("The group " + group + " has the categories:\n" + $scope.groupArray[i].contextPacks.join('\n'));
        }
      }
    };

    $scope.displayStudentInfo = function (student){
      $scope.studentCategories = [];
      for(var i =0; i<$scope.selectedStudents.length; i++){
        if($scope.selectedStudents[i].firstName == student.firstName && $scope.studentArray[i].lastName == student.lastName){
          for(var j=0; j<$scope.selectedStudents[i].contextTags.length; j++){
            $scope.studentCategories.push($scope.selectedStudents[i].contextTags[j].tagName);
          }
          alert("The student " + student.firstName + " " + student.lastName + " has the categories:\n" + $scope.studentCategories.join('\n'));
        }
      }
    };

    $scope.assignWords = function () {
      $scope.individualStudentCategories = [];
      $scope.userSideStudentCategories = [];
      //Checks to make sure there are selected categories
      if ($scope.selectedCategories.length > 0) {
        //For each of the checked students, push their packs onto an array
        for (var i = 0; i < $scope.checkedStudents.length; i++) {
          $scope.studentCategoryArray = [];
          for (var a = 0; a < $scope.checkedStudents[i].contextTags.length; a++){
            $scope.studentCategoryArray.push({
              tagName:$scope.checkedStudents[i].contextTags[a].tagName,
              creatorID:$scope.checkedStudents[i].contextTags[a].creatorID
            })
          }
          $scope.checkCategoryDups($scope.studentCategoryArray, $scope.selectedCategories);
          //Push the selected categories onto the array locally
          for (var j = 0; j < $scope.selectedCategories.length; j++) {
            $scope.studentCategoryArray.push({
              tagName:$scope.selectedCategories[j],
              creatorID:$scope.currentUser._id
            });
          }
          $http.patch('/api/students/' + $scope.checkedStudents[i]._id,
            {contextTags: $scope.studentCategoryArray});
        }
        //Go through each selected group
        console.log($scope.selectedGroups.length);
        for (var k=0; k <$scope.selectedGroups.length; k++){
          //Check for duplicate categories to the ones we want to push
          for (var l = 0; l<$scope.groupArray.length; l++){
            $scope.checkCategoryDups($scope.groupArray[l].contextPacks,$scope.selectedCategories);
            if($scope.selectedGroups[k].groupName == $scope.groupArray[l].groupName){
              for(var m=0; m<$scope.selectedCategories.length; m++){
                $scope.groupArray[l].contextPacks.push($scope.selectedCategories[m]);
              }
            }
          }
          //Update the group's categories
          $http.patch('/api/users/'+$scope.currentUser._id+'/group',{
            groupList:$scope.groupArray
          });
        }
      }
      $scope.getAll();
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

  });
