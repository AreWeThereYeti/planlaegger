"use strict";

app.controller('DialogCtrl', [ '$window', '$routeParams', '$rootScope', function ($window, $routeParams, $rootScope) {
	//Save reference to controller in order to avoid reference soup
	var Dialog = this;

	Dialog.openFormularDialog = function(){

	};

	Dialog.closeDialog = function(){
		if($rootScope.dialog != ''){
			$rootScope.dialog = '';
		}
	};

  Dialog.exportPlanner = function(){
    var route = $routeParams.id;
    $window.open('planner/'+route);
  }

}]);