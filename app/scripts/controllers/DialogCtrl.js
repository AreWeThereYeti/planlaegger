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
   var exportObject = [
      {topic: "some topic", value: "some title", goals: ["some goal", "another goal"]},
      {topic: "another topic", value: "another title", goals: ["some goal", "another goal"]}
    ];
    var route = $routeParams.id;
    var exportWindow = window.open('views/exportView.html', '_blank' ,"height=600, width=600");

    exportWindow.onload = function () {
      // setup copy button
      var button = document.createElement('div');

      button.innerHTML = "<button class='btn' style='height: 40px; width: 250px; text-align: left; margin: 0;  cursor: pointer; outline: 0; border: none; color: #ffffff; background-color: #dc4320; padding: 15px;'>Kopier valgte forløb</button>";
      exportWindow.document.body.appendChild(button);

      // setup table
      var table = document.createElement("TABLE");



      for(var i = 0; i<exportObject.length; i++){
        // Create an empty <tr> element and add it to the 1st position of the table:
        var row = table.insertRow(i);

        // Insert new cells (<td> elements) at the 1st and 2nd ... position of the "new" <tr> element:
        var periode = row.insertCell(0);
        var forlob = row.insertCell(1);
        var maal = row.insertCell(2);
        var bemarkninger = row.insertCell(3);

        forlob.innerHTML = exportObject[i].topic + "<br> <b>" + exportObject[i].value+ "</b>";

        var goalList = '<ul>';
        angular.forEach(exportObject[i].goals, function(goal){
          goalList += "<li>" + goal + "</li>"
        });
        goalList += "</ul>";

        maal.innerHTML = "<p>en masse tekstt</p>"+ "<b>noget text</b>" + "<br\> <p>" + goalList + "</p>";

      }

   // create table Head
      // Create an empty <thead> element and add it to the table:
      var header = table.createTHead();

      // Create an empty <tr> element and add it to the <thead>:
      var row = header.insertRow(0);

      // Insert new cells (<td> elements) at the 1st and 2nd ... position of the "new" <tr> element:
      var periode = row.insertCell(0);
      var forlob = row.insertCell(1);
      var maal = row.insertCell(2);
      var bemarkninger = row.insertCell(3);

      // Add some bold text in the new cells:
      periode.innerHTML = "Periode";
      forlob.innerHTML = "Forløb";
      maal.innerHTML = "Mål";
      bemarkninger.innerHTML = "Bemærkninger";

  //table.innerHTML = "Hello!";
      exportWindow.document.body.appendChild( table );


    };
    //$window.open('planner/'+route);
  }

}]);