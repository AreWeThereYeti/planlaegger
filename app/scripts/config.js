'use strict';

var app = angular.module('app', [
	'ngResource',
	'ngRoute',
  'gyldendal.services',
  'gyldendal.directives',
  'gyldendal.filters',
  'angularSpinner',
  'ang-drag-drop',
  'nsPopover',
  'ngTouch'
])

.config(['$routeProvider', '$locationProvider' ,function ($routeProvider, $locationProvider) {

	$routeProvider
    .when('/', {
      templateUrl: 'views/overview.html',
      controller: 'OverviewCtrl',
      controllerAs: 'Overview',
      title: 'Oversigt',
      resolve: {
        entries: function (getdataservice, $route) {
          return getdataservice.getAllOrganizers($route.current.params);
        },
        planners: function(getdataservice, $route){
          return getdataservice.getPlannerList($route.current.params);
        }
      }
    })
    .when('/planner/:id', {
      templateUrl: 'views/planlaegger.html',
      controller: 'PlanlaeggerCtrl',
      controllerAs: 'Plan',
      resolve: {
        planner: function (getdataservice, $route) {
          return getdataservice.getOrganizer($route.current.params);
        }/*,
        plannerData: function (getdataservice, $route) {
          getdataservice.getOrganizer($route.current.params).then(function(data){
            return getdataservice.getPlanner(angular.fromJson(data.data.content).plannerID);
          })
        }*/
      }
    })
}])

  .run(['$rootScope','$location', function( $rootScope, $location) {
    //	Look for route changes
    $rootScope.$on('$routeChangeStart', function(e, curr, prev) {
      //	Check if promise is resolves on route change. Show loader while processing
      if (curr.$$route && curr.$$route.resolve) {
        // Show a loading message until promises are not resolved
        $rootScope.loadingView = true;
      }
    });

    //	Listen to when route has successfully changed
    $rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
      // Hide loading message
      $rootScope.loadingView = false;
      // Set path in rootvariable
      $rootScope.showSection = $location.path();
    });
  }]);