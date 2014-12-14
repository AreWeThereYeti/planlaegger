"use strict";

app.controller('OverviewCtrl', [ 'planners', '$timeout', 'entries', '$rootScope', '$location', 'getdataservice', '$scope', '$route', function (planners, $timeout, entries, $rootScope, $location, getdataservice, $scope, $route) {

	//Save reference to controller in order to avoid reference soup
	var Overview = this;
  // intial active sort
  Overview.predicate = 'timestamp';
  Overview.reverse = false;

  Overview.planners = planners.data;
  console.log(Overview.planners);


  // set page title
  $rootScope.title = "Gyldendal Planlægger";

  // dummy list data
  Overview.entries = entries.data;
  console.log(entries.data);


  $scope.changeRange = function(range){
    Overview.filterRange = range;
  };


}]);