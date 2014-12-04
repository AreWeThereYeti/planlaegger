"use strict";

app.controller('ToolbarCtrl', ['$scope', function ($scope) {
  //Save reference to controller in order to avoid reference soup
  var Toolbar = this;



  //Test variable. If you see it when the app runs you are good to go
  Toolbar.testVar = 'This is data from the menubar!';
}]);