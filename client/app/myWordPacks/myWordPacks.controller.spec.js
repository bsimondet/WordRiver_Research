'use strict';

describe('Controller: MyWordPacksCtrl', function () {

  // load the controller's module
  beforeEach(module('WordRiverApp'));

  var MyWordPacksCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MyWordPacksCtrl = $controller('MyWordPacksCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
