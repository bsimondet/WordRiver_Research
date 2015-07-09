'use strict';

describe('Controller: MyContextPacksCtrl', function () {

  // load the controller's module
  beforeEach(module('WordRiverApp'));

  var MyContextPacksCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MyContextPacksCtrl = $controller('MyContextPacksCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
