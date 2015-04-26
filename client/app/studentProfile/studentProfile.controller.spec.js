'use strict';

describe('Controller: StudentProfileCtrl', function () {

  // load the controller's module
  beforeEach(module('WordRiverApp'));
  beforeEach(module('socketMock'));

  var StudentProfileCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StudentProfileCtrl = $controller('StudentProfileCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });

  //it('test the getELementsByID function' , function() {
  //  scope.testResultArray = [];
  //  scope.testObjectArray = scope.currentUser.studentList;
  //  scope.testIdArray = scope.students._id;
  //});

  it('getElementsByID test', function () {
    scope.idArray = [];
    scope.idArray[0] = "2";
    scope.idArray[1] = "4";
    scope.objectArray = [];
    scope.objectArray.push({name:"Bob", _id: "0"}) ;
    //console.log(scope.objectArray[0].name);
    //console.log(scope.objectArray[0]._id);
    scope.objectArray.push({name:"Fred", _id: "4"}) ;
    scope.objectArray.push({name:"Alice", _id: "2"}) ;
    //scope.objectArray[0] = [{name: "Bob", _id: "0"}];
    //scope.objectArray[0].name = "Bob";
    //scope.objectArray[0]._id = "0";
    //scope.objectArray[1].name = "Fred";
    //scope.objectArray[1]._id = "4";
    //scope.objectArray[2].name = "Alice";
    //scope.objectArray[2]._id = "2";
    //scope.objectArray[1] = [{name: "Fred", _id: "4"}];
    //scope.objectArray[2] = [{name: "Alice", _id: "2"}];
    scope.resultArray = [];

    scope.getElementsByID(scope.idArray,scope.objectArray,scope.resultArray);
    console.log(scope.resultArray);
    console.log(scope.objectArray);
    expect(scope.resultArray[0].name).toBe("Alice")
  });
});
