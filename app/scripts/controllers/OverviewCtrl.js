"use strict";

app.controller('OverviewCtrl', [ 'planners', '$timeout', 'entries', '$rootScope', '$location', 'getdataservice', '$scope', '$route', function (planners, $timeout, entries, $rootScope, $location, getdataservice, $scope, $route) {

	//Save reference to controller in order to avoid reference soup
	var Overview = this;
  // intial active sort
  Overview.predicate = 'created';
  Overview.reverse = false;
  Overview.planners = planners.data;

  // set page title
  $rootScope.title = "Gyldendal Planlægger";

  // list data
  Overview.entries = entries.data;

  // open/init popup if product param is present
  if(angular.isDefined($route.current.params.product)){

    // filter Overview.entries by product
    Overview.productEntries = [];
    angular.forEach(Overview.entries, function(entry){
      if(entry.subjects[0] == $route.current.params.product){
        Overview.productEntries.push(entry);
      }
    });

    $rootScope.popup = true;
  }


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

  // sends user to a planner view
  Overview.goToPlanner = function(plannerID){
    if(window.parent.updatePlannerUrl) {
      $location.path('/planner/' + plannerID).replace();
      window.parent.updatePlannerUrl('/planner/' + plannerID);
    } else {
      $location.path('/planner/' + plannerID);
    }
  }
/*  Overview.goToPlanner = function(plannerID){
    if(window.parent.updatePlannerUrl) {
      $location.path('/planner/' + plannerID).replace();
      window.parent.updatePlannerUrl();
    } else {
      $location.path('/planner/' + plannerID);
    }
  }*/
}]);