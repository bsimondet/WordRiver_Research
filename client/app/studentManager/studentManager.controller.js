'use strict';

angular.module('WordRiverApp')
  .controller('StudentManagerCtrl', function ($scope, $location, $http, Auth) {
    //add group, delete group,
    $scope.studentList = []; //List of user references to students
    $scope.students = []; //List of actual student objects
    $scope.currentUser = Auth.getCurrentUser();
    $scope.groupField = "";
    $scope.studentField = "";
    $scope.localGroupArray = [];
    $scope.selectedGroups = [];
    $scope.selectedStudents = [];
    $scope.studentsInGroup = []; //Student references
    $scope.selectedGroupName = "";
    $scope.selectedGroup = {};
///////////////////////////////////

    //Be sure we change the getStudents and getGroups. The Schema was changed and now we need to go from the new models rather than through user.

    $scope.getStudentList = function(){
      $scope.studentList = $scope.currentUser.studentList;
    };

    $scope.getStudentList();
//////////////////////////////////
    $scope.getGroups = function(){
      $http.get('/api/user').success(function(user) {
        $scope.user = user;
        $scope.groups = $scope.currentUser.groups;
      });
      $scope.localGroupArray = $scope.currentUser.groupList;
    };
    $scope.getGroups();
////////////////////////////////////
    $scope.getStudents = function(){
      for(var i = 0; i < $scope.studentList.length; i++) {
        $http.get("/api/students/" + $scope.studentList[i].studentID).success(function(student) {
          $scope.students.push(student);
        })
      }
    };
    $scope.getStudents();
////////////////////////////////////

    $scope.addGroup = function () {
      if ($scope.groupField.length >= 1) {
        var newGroup = {groupName: $scope.groupField, contextPacks: []};
        $scope.localGroupArray.push(newGroup);
        $http.patch('/api/users/' + $scope.currentUser._id + '/group',
          {groupList: $scope.localGroupArray}
        ).success(function(){
          });
      }
      $scope.groupField="";
      $scope.getGroups();
    };


   $scope.removeGroup = function () {
      $http.patch('/api/users/' + $scope.currentUser._id + '/group',
         {groupList: $scope.localGroupArray}
      ).success(function(){
          });

    $scope.groupField="";
     $scope.getGroups();
   };

    //returns -1 if student is not in list. should never actually return -1.
    $scope.findStudentInList = function(student){
      var index = -1;
      for(var i = 0; i < $scope.studentList.length; i++){
        if($scope.studentList[i].studentID == student){
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
    var studentIndex = $scope.findStudentInList(student);
    if($scope.studentList[studentIndex].groupList.indexOf(group) == -1){
      $scope.studentList[studentIndex].groupList.push(group);
      if(group == $scope.selectedGroupName){
        $scope.studentsInGroup.push($scope.studentList[studentIndex]);
      }
      $scope.addGroupsContextPacksToStudent(student);
    }
  };

    $scope.addGroupsContextPacksToStudent = function(student){
      var fullStudent = $scope.studentList[$scope.findStudentInList(student)];
      for(var i = 0; i < $scope.selectedGroups.length; i++) {
        var groupIndex = $scope.findGroupInList($scope.selectedGroups[i]);
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
        var studentIndex = $scope.findStudentAccount(student.studentID);
        var notAdded = true;
        for(var j = 0; j < $scope.students[studentIndex].contextTags.length; j++){
          if(($scope.students[studentIndex].contextTags[j].creatorID == $scope.currentUser._id) && ($scope.students[studentIndex].contextTags[j].tagName == contextArray[i])){
            notAdded = false;
          }
        }
        if(notAdded){
          $scope.students[studentIndex].contextTags.push({tagName: contextArray[i], creatorID: $scope.currentUser._id});
          //$scope.addTilesToStudent($scope.students[studentIndex], contextArray[i]);
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
    };

    //Takes in a group name
    $scope.allCheckedGroups = function(category){
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


    $scope.displayGroupInfo = function(group){
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
        console.log("Things Should show up");
        return result * sortOrder;
      }
    };
    //////////////////////////////////////////////////////////////////////////

    //making remove for students from groups.
    $scope.removeStudentFromGroup = function (student) {
      console.log("started");
      for (var i = 0; i < $scope.studentList.length; i++) {
        if (student == $scope.studentList[i]) {
          console.log("found the student");
          for (var j = 0; j < $scope.studentList[i].groupList.length; j++) {
            console.log($scope.selectedGroupName + " "+ $scope.studentList[i].groupList[j] )
            if ($scope.studentList[i].groupList[j] == $scope.selectedGroup._id) {
              console.log("about to splice");
              $scope.studentList[i].groupList.splice(j, 1);

              ////Start here once the seed is changed
              //$http.deleteFromGroup('api/students/' + $scope.currentUser._id + '/student',
              //  //Insert code to update the database
              //).success(function () {
              //    //Insert
              //  });

              console.log("did it");
              break;
            }
          }
          break;
        }
      }
      for (var h = 0; h < $scope.studentsInGroup.length; h++) {
        if (student = $scope.studentsInGroup[h]) {
          $scope.studentsInGroup.splice(h, 1);
        }
      }
      $scope.displayGroupInfo($scope.selectedGroup);
    };

    //////////////////////////////////////////////////////////
    //Trying to write and edit group name function. Having troubles with changing just the name.
    $scope.editGroupName = function (index) { // This is a good function

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

});

