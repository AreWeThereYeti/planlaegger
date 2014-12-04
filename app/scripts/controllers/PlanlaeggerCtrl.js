"use strict";

app.controller('PlanlaeggerCtrl', [ 'plannerData', 'planner', '$rootScope', '$location', 'getdataservice', '$scope', '$route', function (plannerData, planner, $rootScope, $location, getdataservice, $scope, $route) {

  //Save reference to controller in order to avoid reference soup
  var Plan = this;

  // current planner
  Plan.current = planner.data;

  Plan.plandata = angular.fromJson(plannerData.data);

}]);