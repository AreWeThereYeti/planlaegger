"use strict";

app.controller('OverviewCtrl', [ '$timeout', 'entries', '$rootScope', '$location', 'getdataservice', '$scope', '$route', function ($timeout, entries, $rootScope, $location, getdataservice, $scope, $route) {

	//Save reference to controller in order to avoid reference soup
	var Overview = this;
  // intial active sort
  Overview.predicate = 'timestamp';
  Overview.reverse = false;


  // dummy list data
  Overview.entries = entries.data;
  console.log(entries.data);


  $scope.changeRange = function(range){
    Overview.filterRange = range;
  };


}]);