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

  //it('getElementsByID test', function () {
  //  scope.idArray = [];
  //  scope.idArray[0] = "2";
  //  scope.idArray[1] = "4";
  //  scope.objectArray = [];
  //  scope.objectArray[0] = [];
  //  scope.objectArray[0] = [{name: "", _id: ""}];
  //  scope.objectArray[0] = [{name: "Bob", _id: "0"}];
  //  scope.objectArray[1] = [{name: "Fred", _id: "4"}];
  //  scope.objectArray[2] = [{name: "Alice", _id: "2"}];
  //  scope.resultArray = [];
  //  scope.getElementsByID(scope.idArray,scope.objectArray,scope.resultArray);
  //  console.log(scope.resultArray);
  //  expect(scope.resultArray[0].name).toBe("Alice")
  //});
});
