'use strict';

var app = angular.module('app', [
	'ngResource',
	'ngRoute',
  'gyldendal.services',
  'gyldendal.directives',
  'gyldendal.filters',
  'angularSpinner'
])

.config(['$routeProvider',function ($routeProvider) {

	$routeProvider
			.when('/', {
				templateUrl: '../views/main.html',
				controller: 'MainCtrl',
				controllerAs: 'Main',
        resolve: {
          links: function (dataService, $route) {
            return getdataservice.getAllOrganizers($route.current.params);
          }
        }
			})
}]);
