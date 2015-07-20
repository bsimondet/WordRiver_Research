'use strict';

angular.module('WordRiverApp')
  .controller('MyStudentsCtrl', function ($scope, $location, $http, Auth) {
    $scope.myStudents = []; //List of actual student objects
    $scope.currentUser = Auth.getCurrentUser();

    $scope.getStudents = function(){
      $http.get("/api/students").success(function(myStudents) {
        for(var i = 0; i < myStudents.length; i++){
          if($scope.inArray(myStudents[i].teachers, $scope.currentUser._id)){
            $scope.myStudents.push(myStudents[i]);
          }
        }
      });
    };

    $scope.getStudents();

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
                "name": words[index].name
              });
            }
          } else if($scope.currentUser.words.indexOf(words[index]._id) != -1){
            if($scope.wordsArray.indexOf(words[index]) == -1){
              $scope.wordsArray.push(words[index]);
            }
            if($scope.wordsHolderIDs.indexOf(words[index]._id) == -1){
              $scope.wordsHolder.push({
                "_id": words[index]._id,
                "name": words[index].name
              });
            }
          }
        }
      });
    };

    $scope.getWords();

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

    $scope.inArray= function(array, item){
      for(var i = 0; i < array.length; i++){
        if(array[i] == item){
          return true;
        }
      }
      return false;
    };

    $scope.viewAddStudent = false;
    $scope.viewEditStudent = false;
    $scope.viewStudentInfo = false;
    $scope.viewStudentInfoItem = false;
    $scope.viewStudentClasses = false;
    $scope.viewStudentContext = false;
    $scope.viewStudentWordPacks = false;
    $scope.viewStudentWords = false;

    $scope.firstname = "";
    $scope.lastname = "";
    $scope.addStudent = function() {
      $http.post('/api/students/',
        {firstName:$scope.firstname, lastName:$scope.lastname, teachers: $scope.currentUser._id}
      ).success(function(student){
          $scope.myStudents.push(student);
          $scope.addStudentIDToTeacher(student._id);
          $scope.firstname="";
          $scope.lastname="";
        });
    };

    $scope.addStudentIDToTeacher = function(toAddID){
      $http.put('api/users/' + $scope.currentUser._id + '/addStudent',
        {studentID: toAddID}
      ).success(function () {
          console.log("Successfully added ID to teacher!");
        });
    };

    $scope.editFirstName = "";
    $scope.editLastName = "";
    $scope.editStudent = function(currentEditStudent){
      var studentToEdit = null;
      for(var i = 0; i< $scope.myStudents.length; i++){
        if(currentEditStudent._id == $scope.myStudents[i]._id){
          studentToEdit = $scope.myStudents[i];
        }
      }
      console.log("Fisrtname "+$scope.editFirstName);
      console.log($scope.editLastName);
      $http.put('/api/students/' + studentToEdit + '/editStudent',
        {firstName:$scope.editFirstName, lastName:$scope.editLastName}
      ).success(function(student){
          for(var i = 0; i < $scope.myStudents.length; i++){
            if(student._id == $scope.myStudents[i]._id){
              $scope.myStudents[i] = student;
            }
          }
          $scope.editFirstName="";
          $scope.editLastName="";
        });
    };

    $scope.toggleAddStudent = function(info){
      if(info == 'on'){
        $scope.viewAddStudent = true;
        $scope.viewStudentInfo = false;
        $scope.toggleStudentInfo('off');
        $scope.toggleEditStudent('off');
      } else if(info == 'off'){
        $scope.viewAddStudent = false;
      }
    };

    $scope.currentEditStudent = null;
    $scope.toggleEditStudent = function(info){
      if(info == 'on'){
        $scope.toggleStudentInfo('off');
        $scope.toggleAddStudent('off');
        $scope.viewEditStudent = true;
      } else if(info == 'off'){
        $scope.viewEditStudent = false;
      }
    };

    $scope.toggleCurrentEditStudent = function (student){
      $scope.currentEditStudent = student;
    };

    $scope.toggleCurrentStudent = function (student){
      $scope.currentStudent = student;
    };

    $scope.currentStudent = null;
    $scope.viewStudentInformation = function(student){
      $scope.toggleCurrentStudent(student);
      $scope.toggleEditStudent('off');
      $scope.toggleStudentInfo('off');
      $scope.toggleAddStudent('off');
      $scope.viewStudentInfo = true;

    };

    $scope.toggleStudentInfo = function(info){
      if(info == 'classes'){
        $scope.viewStudentClasses = true;
        $scope.viewStudentContext = false;
        $scope.viewStudentWordPacks = false;
        $scope.viewStudentWords = false;
        $scope.viewStudentInfoItem = true;
      } else if(info == 'groups'){
        $scope.viewStudentClasses = false;
        $scope.viewStudentContext = false;
        $scope.viewStudentWordPacks = false;
        $scope.viewStudentWords = false;
        $scope.viewStudentInfoItem = true;
      }else if(info == 'context'){
        $scope.viewStudentClasses = false;
        $scope.viewStudentContext = true;
        $scope.viewStudentWordPacks = false;
        $scope.viewStudentWords = false;
        $scope.viewStudentInfoItem = true;
      }else if(info == 'wordPacks'){
        $scope.viewStudentClasses = false;
        $scope.viewStudentContext = false;
        $scope.viewStudentWordPacks = true;
        $scope.viewStudentWords = false;
        $scope.viewStudentInfoItem = true;
      }else if(info == 'words'){
        $scope.viewStudentClasses = false;
        $scope.viewStudentContext = false;
        $scope.viewStudentWordPacks = false;
        $scope.viewStudentWords = true;
        $scope.viewStudentInfoItem = true;
      }else if(info == 'off'){
        $scope.viewStudentInfoItem = false;
        $scope.viewStudentClasses = false;
        $scope.viewStudentContext = false;
        $scope.viewStudentWordPacks = false;
        $scope.viewStudentWords = false;
      }
    };

    $scope.studentClasses = [];

    $scope.getStudentClasses = function(){
      $scope.studentClasses = [];
      for(var i = 0; i < $scope.currentStudent.classList.length; i++){
        for(var j = 0; j < $scope.currentUser.classList.length; j++){
          if($scope.currentUser.classList[j]._id == $scope.currentStudent.classList[i]._id && $scope.studentClasses.indexOf($scope.currentUser.classList[j]) == -1){
            $scope.studentClasses.push({
              "_id": $scope.currentUser.classList[j]._id,
              "className": $scope.currentUser.classList[j].className,
              "groupList": $scope.getStudentGroups($scope.currentStudent.classList[i].groupList)
          });
          }
        }
      }
    };

    $scope.getStudentGroups = function(studentGroupList){
      var toReturn = [];
      var toReturnIDs = [];
      for(var i = 0; i < $scope.currentUser.classList.length; i++){
        for(var j = 0; j < $scope.currentUser.classList[i].groupList.length; j++){
          for(var k = 0; k < studentGroupList.length; k++){
            if($scope.currentUser.classList[i].groupList[j]._id == studentGroupList[k]){
              for(var l = 0; l < toReturn.length; l++){
                toReturnIDs.push(toReturn[l]._id);
              }
              if(toReturnIDs.indexOf($scope.currentUser.classList[i].groupList[j]._id) == -1){
                toReturn.push({
                  "id": $scope.currentUser.classList[i].groupList[j]._id,
                  "groupName": $scope.currentUser.classList[i].groupList[j].groupName
                });
              }
            }
          }
        }
      }
      return toReturn;
    };

    $scope.studentContextPacks = [];

    $scope.getStudentContextPacks = function (){
      $scope.getStudentWordPacks();
      $scope.studentContextPacks = [];
      var alreadyCheckedContextIDs =[];
      for(var i = 0; i < $scope.contextPacksHolder.length; i++){
        for(var j = 0; j < $scope.contextPacksHolder[i].wordPacks.length; j++){
          for(var k = 0; k < $scope.studentWordPacks.length; k++){
            if($scope.contextPacksHolder[i].wordPacks[j]._id == $scope.studentWordPacks[k]._id && alreadyCheckedContextIDs.indexOf($scope.contextPacksHolder[i]._id) == -1){
              alreadyCheckedContextIDs.push($scope.contextPacksHolder[i]._id);
              $scope.studentContextPacks.push({
                "_id": $scope.contextPacksHolder[i]._id,
                "name": $scope.contextPacksHolder[i].name,
                "wordPacks": $scope.getStudentWordPacksForContext($scope.contextPacksHolder[i].wordPacks, $scope.studentWordPacks)
              });
            }
          }
        }
      }
    };

    $scope.studentWordPacks = [];

    $scope.getStudentWordPacksForContext = function(contextWordPacks, studentWordPacks){
      var toReturn = [];
      for(var i = 0; i < contextWordPacks.length; i++){
        for(var j = 0; j < studentWordPacks.length; j++){
          if(contextWordPacks[i]._id == studentWordPacks[j]._id && toReturn.indexOf(studentWordPacks[j]) ==-1){
            toReturn.push({
              "_id": studentWordPacks[j]._id,
              "name": studentWordPacks[j].name
            });
          }
        }
      }
      return toReturn;
    };

    $scope.getStudentWordPacks = function (){
      $scope.studentWordPacks = [];
      for(var i = 0; i < $scope.wordPacksHolder.length; i++){
        for(var j = 0; j < $scope.currentStudent.wordPacks.length; j++){
          if($scope.currentStudent.wordPacks[j] == $scope.wordPacksHolder[i]._id && $scope.studentWordPacks.indexOf($scope.wordPacksHolder[i]) == -1){
            $scope.studentWordPacks.push({
              "_id": $scope.wordPacksHolder[i]._id,
              "name": $scope.wordPacksHolder[i].name
            });
          }
        }
      }
    };

    $scope.studentWords = [];

    $scope.getStudentWords = function (){
      $scope.studentWords = [];
      for(var i = 0; i < $scope.wordsHolder.length; i++){
        for(var j = 0; j < $scope.currentStudent.words.length; j++){
          if($scope.currentStudent.words[j] == $scope.wordsHolder[i]._id && $scope.studentWords.indexOf($scope.wordsHolder[i]) == -1){
            $scope.studentWords.push($scope.wordsHolder[i]);
          }
        }
      }
    };
  });
