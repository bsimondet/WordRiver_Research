'use strict';

describe('Controller: MyClassesCtrl', function () {

  // load the controller's module
  beforeEach(module('wordRiverAppApp'));

  var MyClassesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MyClassesCtrl = $controller('MyClassesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
