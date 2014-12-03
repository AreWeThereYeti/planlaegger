"use strict";

app.controller('PlanlaeggerCtrl', [ '$timeout', 'planner', '$rootScope', '$location', 'getdataservice', '$scope', '$route', function ($timeout, planner, $rootScope, $location, getdataservice, $scope, $route) {

  //Save reference to controller in order to avoid reference soup
  var Plan = this;

  // current planner
  Plan.current = planner.data;


}]);