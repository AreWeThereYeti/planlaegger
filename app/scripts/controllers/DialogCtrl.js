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
   var exportObject = angular.fromJson($rootScope.current.content);
    var route = $routeParams.id;
    var exportWindow = window.open('views/exportView.html', '_blank' ,"height=600, width=600");

    exportWindow.onload = function () {

      // set window styling
      var x = document.createElement("STYLE");
      var t = document.createTextNode(
        "table {" +
          "width: 100%;" +
          "margin-top: 10px;" +
          "border: 1px solid #000000;" +
          "font-size: 24px;" +
          "font-family: arial, helvetica, sans-serif;" +
          "color:#000000;" +
          "border-collapse:collapse;" +
          "border-spacing:0}"+
        "thead {"+
          "font-size: 14px;"+
          "font-weight: bold;"+
        "}"+
        "td {border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;}"+
        " .btn {line-height: 40px; width: 250px; text-align: left; padding: 0px 15px; margin: 0;  cursor: pointer; outline: 0; border: none; color: #ffffff; background-color: #dc4320; font-family: arial, helvetica, sans-serif; font-size: 14px;}"
      );
      x.appendChild(t);
      exportWindow.document.head.appendChild(x);

      // setup copy button
/*      var button = document.createElement('div');

      button.innerHTML = "<button id='copy_button' data-clipboard-target='table' class='btn'>Kopier valgte forløb</button>";
      exportWindow.document.body.appendChild(button);*/

      // setup table
      var table = document.createElement("TABLE");
      table.setAttribute('id', 'table');

      // fill table with course data for each selectedcoursein data array
      for(var i = 0; i<exportObject.data.length; i++){
        // Create an empty <tr> element and add it to the 1st position of the table:
       var row = table.insertRow(i);

        // Insert new cells (<td> elements) at the 1st and 2nd ... position of the "new" <tr> element:
        var periode = row.insertCell(0);
        var forlob = row.insertCell(1);
        var maal = row.insertCell(2);
        var bemarkninger = row.insertCell(3);

        // fill forløb and mål cells with data
        forlob.innerHTML = exportObject.data[i].forloeb;
        maal.innerHTML = exportObject.data[i].maal;

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

      // set cell widths
      periode.setAttribute("width", "12.5%");
      forlob.setAttribute("width", "20%");
      maal.setAttribute("width", "42.5%");
      bemarkninger.setAttribute("width", "25%");

      // Add some bold text in the new cells:
      periode.innerHTML = "Periode";
      forlob.innerHTML = "Forløb";
      maal.innerHTML = "Mål";
      bemarkninger.innerHTML = "Bemærkninger";

  //table.innerHTML = "Hello!";
      exportWindow.document.body.appendChild( table );


    };

  }

}]);