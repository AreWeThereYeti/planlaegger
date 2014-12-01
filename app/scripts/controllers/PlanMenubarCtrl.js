"use strict";

app.controller('PlanMenubarCtrl', ['$routeParams', 'getdataservice', '$rootScope', '$scope', '$location', function ($routeParams, getdataservice, $rootScope, $scope, $location) {
  //Save reference to controller in order to avoid reference soup
  var PlanMenubar = this;

  //Test variable. If you see it when the app runs you are good to go
  PlanMenubar.testVar = 'This is data from the menubar!';



}]);