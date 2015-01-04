"use strict";

app.controller('OverviewCtrl', [ 'planners', '$timeout', 'entries', '$rootScope', '$location', 'getdataservice', '$scope', '$route', function (planners, $timeout, entries, $rootScope, $location, getdataservice, $scope, $route) {

	//Save reference to controller in order to avoid reference soup
	var Overview = this;
  // intial active sort
  Overview.predicate = 'timestamp';
  Overview.reverse = false;

  Overview.planners = planners.data;


  // set page title
  $rootScope.title = "Gyldendal Planlægger";

  // list data
  Overview.entries = entries.data;

  // delete planner
  Overview.deletePlanner = function(objectID){
    if(confirm("Der du sikker på at du vil slette denne planlægger?")) {

      getdataservice.deleteOrganizer(objectID).then(function () {
        $route.reload();
      });
    }
  };

  $scope.changeRange = function(range){
    Overview.filterRange = range;
  };


}]);