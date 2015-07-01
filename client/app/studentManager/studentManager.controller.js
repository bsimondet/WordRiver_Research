'use strict';

angular.module('WordRiverApp')
  .controller('StudentManagerCtrl', function ($scope, $location, $http, Auth) {
    //add group, delete group,
    $scope.studentList = []; //List of user references to students
    $scope.students = []; //List of actual student objects
    $scope.studentByID = []; //List of the current users students listed by id
    $scope.currentUser = Auth.getCurrentUser();
    $scope.groupField = "";
    $scope.studentField = "";
    $scope.localGroupArray = [];
    $scope.selectedGroups = [];
    $scope.selectedStudents = [];
    $scope.studentsInGroup = []; //Student references
    $scope.selectedGroupName = "";
    $scope.selectedGroup = {};
    $scope.showGroups = true;
    $scope.studentGroups = [];
    $scope.selectedStudent = [];
    $scope.tiles = [];
    $scope.localGroupArray = $scope.currentUser.groupList;
    $scope.help = false;
    $scope.toGroupSort = "";
    $scope.groupOrder = false;
    $scope.needToAddID = false;
    $scope.IDtoAdd = "";
    $scope.firstname="";
    $scope.lastname="";

///////////////////////////////////
//    $scope.getStudentList = function(){
//      if(Auth.isLoggedIn()) {
//        $scope.studentList = $scope.currentUser.studentList;
//      }
//    };
//
//    $scope.getStudentList();
//////////////////////////////////

    $scope.getGroups = function(){
      $http.get("/api/users/me").success(function(user){
        $scope.currentUser = user;
        $scope.localGroupArray = user.groupList;
      })
    };

    $scope.getGroups();

    $scope.getTiles = function(){
      $http.get("/api/tile").success(function(tiles){
        $scope.tiles = tiles;
      });
    };

    $scope.getTiles();

    $scope.toggleHelp = function(){
      if ($scope.help == true)$scope.help = false;
      else $scope.help = true;
    };

    $scope.getStudents = function(){
      $http.get("/api/students").success(function(allStudents) {
        $scope.manageStudents(allStudents);
      });
    };

    $scope.manageStudents = function(myStudents){
      $scope.students = [];
      $scope.studentList = [];
      $scope.studentByID = [];
      for(var i = 0; i < myStudents.length; i++){
        if($scope.inArray(myStudents[i].teachers, $scope.currentUser._id)){
          $scope.students.push(myStudents[i]);
          $scope.studentList.push(myStudents[i]);
          $scope.studentByID.push(myStudents[i]._id);
        }
      }
      if( $scope.needToAddID ){
        $scope.addStudentIDToUser($scope.IDtoAdd);
      }
    };

    $scope.getStudents();

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

    $scope.addStudent = function () {
      if ($scope.firstname.length > 0 && $scope.lastname.length > 0) {
        $http.post('/api/students/',
          {firstName:$scope.firstname, lastName:$scope.lastname, teachers: $scope.currentUser._id}
        ).success(function(object){
            $scope.makeGlobalID(object._id);
          });
      }
      $scope.firstname="";
      $scope.lastname="";
    };

    $scope.makeGlobalID = function (id) {
      $scope.needToAddID = true;
      $scope.getStudents();
      $scope.IDtoAdd = id;
    };

    $scope.addStudentIDToUser = function (toAddID) {
      for(var index = 0; index < $scope.students.length; index++) {
        if ($scope.students[index]._id == toAddID) {
          $http.put('api/users/' + $scope.currentUser._id + '/addStudent',
              {studentID: toAddID}
          ).success(function () {
              //console.log("Successfully added ID to teacher!");
            });
        }
      }
      $scope.IDtoAdd = "";
    };

    $scope.addGroup = function () {
      if ($scope.groupField.length >= 1) {
        var newGroup = {groupName: $scope.groupField, contextPacks: []};
        $scope.localGroupArray.push(newGroup);
        $http.put('/api/users/' + $scope.currentUser._id + '/addGroup',
          {groupName: $scope.groupField}
        ).success(function(){
            $scope.getGroups();
          });
      }
      $scope.groupField="";

    };

    $scope.groupShow = function(){
      $scope.showGroups=true;
    };

    $scope.removeGroup = function (index, group) {
      var choice = confirm("Are you sure you want to delete " + group.groupName + "?");
      if (choice == true) {
        $http.put('/api/users/' + $scope.currentUser._id + '/deleteGroup',
          {group: group._id}
        ).success(function () {
            $scope.getGroups();
          });
        $scope.localGroupArray.splice($scope.findGroupInList(group.groupName), 1);
      }

    };

    //returns -1 if student is not in list. should never actually return -1.
    $scope.findStudentInList = function(student){
      var index = -1;
      for(var i = 0; i < $scope.studentList.length; i++){
        if($scope.studentList[i]._id == student){
          index = i;
        }
      }
      return index;
    };

    //returns -1 if student is not in list. should never actually return -1.
    $scope.findStudentAccount = function(studentID) {
      var index = -1;
      for(var i = 0; i < $scope.students.length; i++){
        if($scope.students[i]._id == studentID){
          index = i;
        }
      }
      return index;
    };

    $scope.findGroupInList = function(groupName){
      var index = -1;
      for(var i = 0; i < $scope.localGroupArray.length; i++){
        if($scope.localGroupArray[i].groupName == groupName){
          index = i;
        }
      }
      return index;
    };

    //Takes in a student's ID and a groups name
    $scope.assignStudentToGroup = function(student, group){
      //console.log(student + " " + group);
      var studentIndex = $scope.findStudentInList(student);
      //console.log(studentIndex);

      if($scope.studentList[studentIndex].groupList.indexOf(group._id) == -1){
        $scope.studentList[studentIndex].groupList.push(group);
        if(group._id == $scope.selectedGroup._id){
          $scope.studentsInGroup.push($scope.studentList[studentIndex]);
        }
        $scope.addGroupsContextPacksToStudent(student);
        $http.put("/api/students/" + student + "/assignToGroup",
          {groupID: group._id}
        ).success(function () {
            $scope.getStudents();
          });
      }

    };

    $scope.addGroupsContextPacksToStudent = function(student){
      var fullStudent = $scope.studentList[$scope.findStudentInList(student)];
      for(var i = 0; i < $scope.selectedGroups.length; i++) {
        var groupIndex = $scope.findGroupInList($scope.selectedGroups[i].groupName);
        $scope.addContextPacksToStudent($scope.localGroupArray[groupIndex].contextPacks, fullStudent)
      }
    };

    $scope.addContextPacksToStudent = function(contextArray, student){
      for(var i = 0; i < contextArray.length; i++){

        //user side
        if(student.contextTags.indexOf(contextArray[i]) == -1) {
          student.contextTags.push(contextArray[i]);
        }

        //student side
        //console.log(student);
        var studentIndex = $scope.findStudentAccount(student._id);
        var notAdded = true;
        for(var j = 0; j < $scope.students[studentIndex].contextTags.length; j++){
          if(($scope.students[studentIndex].contextTags[j].creatorID == $scope.currentUser._id) && ($scope.students[studentIndex].contextTags[j].tagName == contextArray[i])){
            notAdded = false;
          }
        }
        if(notAdded){
          $scope.students[studentIndex].contextTags.push({tagName: contextArray[i], creatorID: $scope.currentUser._id});
          //$scope.addTilesToStudent($scope.students[studentIndex], contextArray[i]);
          $http.put("/api/students/"+student._id+"/addPack", {packId: contextArray[i]});
          $scope.addWordsToStudent(contextArray[i], student);
        }
      }
    };

    $scope.addWordsToStudent = function(pack, student){
      for(var i = 0; i < $scope.tiles.length; i++){
        if($scope.inArray($scope.tiles[i].contextTags, pack)){
          if(!$scope.inArray(student.tileBucket, pack)) {
            student.tileBucket.push(pack);
            $http.put("api/students/" + student._id + "/addWord", {word: $scope.tiles[i]._id});
          }
        }
      }
    };

    $scope.addStudentsToGroups = function(){
      //iterate over all of the students and all of the groups
      //call assignStudentToGroup on each pair
      for(var i = 0; i < $scope.selectedStudents.length; i++){
        for(var j = 0; j < $scope.selectedGroups.length; j++){
          $scope.assignStudentToGroup($scope.selectedStudents[i], $scope.selectedGroups[j]);
        }
      }
      $scope.selectedGroups = [];
      $scope.selectedStudents = [];
    };

    //Takes in a group name
    $scope.allCheckedGroups = function(category){
      //console.log(category);
      var counter;
      for (var i = 0; i < $scope.selectedGroups.length; i++) {
        if ($scope.selectedGroups[i] == category) {
          $scope.selectedGroups.splice(i, 1);
          counter = 1;
        }
      }
      if (counter != 1){
        $scope.selectedGroups.push(category);
      }
    };

    //Takes in a student ID
    $scope.allCheckedStudents = function(category){
      var counter;
      for (var i = 0; i < $scope.selectedStudents.length; i++) {
        if ($scope.selectedStudents[i] == category) {
          $scope.selectedStudents.splice(i, 1);
          counter = 1;
        }
      }
      if (counter != 1){
        $scope.selectedStudents.push(category);
      }
    };

    $scope.displayStudentGroups = function(student){
      $scope.showGroups = false;
      $scope.selectedStudent = student;
      $scope.studentGroups = [];

      for (var i = 0; i < $scope.localGroupArray.length; i++){
        if ($scope.inArray($scope.selectedStudent.groupList, $scope.localGroupArray[i]._id)) {
          $scope.studentGroups.push($scope.localGroupArray[i]);

        }
      }
    };

    $scope.displayGroupInfo = function(group){
      //$scope.showGroups = true;
      $scope.selectedGroupName = group.groupName;
      $scope.studentsInGroup = [];
      $scope.selectedGroup = group;
      for(var i = 0; i < $scope.studentList.length; i++){
        if($scope.inArray($scope.studentList[i].groupList, group._id)){
          $scope.studentsInGroup.push($scope.studentList[i]);
        }
      }
    };


    $scope.inArray= function(array, item){
      for(var i = 0; i < array.length; i++){
        if(array[i] == item){
          return true;
        }
      }
      return false;
    };


    $scope.getStudentGroups = function(student){
      $scope.selectedGroupName = "Groups for "+student.firstName+" "+student.lastName+":";
      $scope.studentsInGroup = student.allGroupsIn;

    };

    $scope.orderBy = function (property) {
      var sortOrder = 1;
      if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
      }
      return function (a,b) {
        //var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        var result = 0;
        if (a[property] < b[property]) {
          result = -1;
        } else if (a[property] > b[property]) {
          result=1;
        } else {
          result = 0;
        }
        //console.log("Things Should show up");
        return result * sortOrder;
      }
    };
    //////////////////////////////////////////////////////////////////////////

    $scope.removeGroupFromStudent = function (group){
      var index = $scope.findGroupInList(group.groupName);
      //console.log(index);
      $scope.selectedGroup = $scope.localGroupArray[index];

      $scope.removeStudentFromGroup($scope.selectedStudent);
      //console.log("Yo");
      for (var i = 0; i < $scope.studentGroups.length; i++){
        //console.log($scope.studentGroups[i]);

        if ($scope.studentGroups[i] == group._id){

          $scope.studentGroups.splice(i, 1);
        }
      }
      $scope.displayStudentGroups($scope.selectedStudent);
    };


    //making remove for students from groups.
    $scope.removeStudentFromGroup = function (student) {
      for (var i = 0; i < $scope.studentList.length; i++) {
        if (student == $scope.studentList[i]) {
          for (var j = 0; j < $scope.studentList[i].groupList.length; j++) {
            //console.log($scope.selectedGroupName + " "+ $scope.studentList[i].groupList[j] )
            if ($scope.studentList[i].groupList[j] == $scope.selectedGroup._id) {
              $scope.studentList[i].groupList.splice(j, 1);

              //Start here once the seed is changed
              $http.put('api/students/' + $scope.studentList[i]._id + '/deleteFromGroup',
                {groupID: $scope.selectedGroup._id}
              ).success(function () {
                  $scope.syncUser();
                });
              break;
            }
          }
          break;
        }
      }
      for (var h = 0; h < $scope.studentsInGroup.length; h++) {
        if (student == $scope.studentsInGroup[h]) {
          $scope.studentsInGroup.splice(h, 1);
        }
      }
      $scope.displayGroupInfo($scope.selectedGroup);
    };

    //////////////////////////////////////////////////////////
    //Trying to write and edit group name function. Having troubles with changing just the name.
    $scope.editGroupName = function (group) { // This is a good function
      var index = $scope.findGroupInList(group.groupName);
      var text = prompt("Provide a new name for " + $scope.localGroupArray[index].groupName + ".", "");
      if (text != null) {
        var choice = confirm("Are you sure you want to change the name of " + $scope.localGroupArray[index].groupName + " to " + text + "?");
        if (choice == true) {

          //$scope.studentList[index].groupList.groupName = text;
          $scope.localGroupArray[index].groupName = text;

          $http.put('/api/users/' + $scope.currentUser._id + '/group',
            {index: index, groupName: text}
          ).success(function () {
              $scope.getStudents();
            });

        }
      }
    };
    $scope.getGroups();
  });

