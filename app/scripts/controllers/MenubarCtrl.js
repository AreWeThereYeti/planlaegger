"use strict";

app.controller('MenubarCtrl', ['$rootScope', function ($rootScope) {
	//Save reference to controller in order to avoid reference soup
	var Menubar = this;

	Menubar.createPlan = function () {
		if($rootScope.dialog == 'create plan'){
			$rootScope.dialog = '';
		}
		else{
			$rootScope.dialog = 'create plan';
		}
	};


	//Test variable. If you see it when the app runs you are good to go
	Menubar.testVar = 'This is data from the menubar!';
}]);