'use strict';

var app = angular.module('app', [
	'ngResource',
	'ngRoute',
  'gyldendal.services',
  'gyldendal.directives',
  'gyldendal.filters',
  'angularSpinner'
])

.config(['$routeProvider', '$locationProvider' ,function ($routeProvider, $locationProvider) {

	$routeProvider
    .when('/', {
      templateUrl: 'views/overview.html',
      controller: 'OverviewCtrl',
      controllerAs: 'Overview',
      resolve: {
        entries: function (getdataservice, $route) {
          return getdataservice.getAllOrganizers($route.current.params);
        }
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