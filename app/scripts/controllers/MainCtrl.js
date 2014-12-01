"use strict";

app.controller('MainCtrl', [function () {
	//Save reference to controller in order to avoid reference soup
	var MainCtrl = this;

	//Test variable. If you see it when the app runs you are good to go
	MainCtrl.testVar = 'We are up and running !';
}]);