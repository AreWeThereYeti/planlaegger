"use strict";

app.controller('DialogCtrl', [ 'colorPickerService', '$window', '$routeParams', '$rootScope', function (colorPickerService, $window, $routeParams, $rootScope) {
	//Save reference to controller in order to avoid reference soup
	var Dialog = this;

	Dialog.openFormularDialog = function(){

	};

	Dialog.closeDialog = function(){
		if($rootScope.dialog != ''){
			$rootScope.dialog = '';
		}
	};

  if(angular.isDefined($rootScope.current) && angular.isDefined($rootScope.current.title)){
    Dialog.newTitle = $rootScope.current.title;
  }

  Dialog.exportPlanner = function(){
   var exportObject = angular.fromJson($rootScope.current.content);
    var route = $routeParams.id;
    var exportWindow = window.open('views/exportView.html', '_blank' ,"height=600, width=600");


// public funtion that generates the course table when called from child window.
    window.myFunc=function(doc){
      var x = doc.createElement("STYLE");
      x.setAttribute("type", "text/css");
      if(x.styleSheet){
        var t =
          " .btn {line-height: 40px; width: 250px; text-align: left; padding: 0px 15px; margin: 0;  cursor: pointer; outline: 0; border: none; color: #ffffff; background-color: "+colorPickerService.getColor($rootScope.current.subjects[0])+"; font-family: arial, helvetica, sans-serif; font-size: 14px;}";
        x.styleSheet.cssText = t;
        doc.head.appendChild(x);

      } else {
        var t = doc.createTextNode(
          " .btn {line-height: 40px; width: 250px; text-align: left; padding: 0px 15px; margin: 0;  cursor: pointer; outline: 0; border: none; color: #ffffff; background-color: "+colorPickerService.getColor($rootScope.current.subjects[0])+"; font-family: arial, helvetica, sans-serif; font-size: 14px;}"
        );
        x.appendChild(t);
        doc.head.appendChild(x);
    }
      // setup table
      var table = doc.createElement("TABLE");
      table.setAttribute('id', 'table');
      table.setAttribute("style", "border-spacing:0; border-collapse:collapse; color:#000000; width:100%; margin-top: 10px; border: 1px solid #000000; font-size: 24px; font-family: arial, helvetica, sans-serif;");

      // fill table with course data for each selectedcoursein data array
      for(var i = 0; i<exportObject.data.length; i++){
        // Create an empty <tr> element and add it to the 1st position of the table:
        var row = table.insertRow(i);

        // Insert new cells (<td> elements) at the 1st and 2nd ... position of the "new" <tr> element:

        var forlob = row.insertCell(0);
        forlob.setAttribute("style", "border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;");

        var maal = row.insertCell(1);
        maal.setAttribute("style", "border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;");

        var forslag = row.insertCell(2);
        forslag.setAttribute("style", "border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;");

        var bemarkninger = row.insertCell(3);
        bemarkninger.setAttribute("style", "border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;");

        // fill forløb and mål cells with data
        forlob.innerHTML = exportObject.data[i].forloeb;
        maal.innerHTML = exportObject.data[i].maal;

      }

      // create table Head
      // Create an empty <thead> element and add it to the table:
      var header = table.createTHead();

      header.setAttribute("style", "background-color:"+colorPickerService.getColor($rootScope.current.subjects[0])+"; color: #FFFFFF; font-size: 14px; font-weight: bold;");

      // Create an empty <tr> element and add it to the <thead>:
      var row = header.insertRow(0);

      // Insert new cells (<td> elements) at the 1st and 2nd ... position of the "new" <tr> element:
      var forlob = row.insertCell(0);
      var maal = row.insertCell(1);
      var forslag = row.insertCell(2);
      var bemarkninger = row.insertCell(3);

      // set cell widths

      forlob.setAttribute("width", "12.5%");
      forlob.setAttribute("style", "border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;");

      maal.setAttribute("width", "42.5%");
      maal.setAttribute("style", "border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;");

      forslag.setAttribute("width", "20%");
      forslag.setAttribute("style", "border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;");

      bemarkninger.setAttribute("width", "25%");
      bemarkninger.setAttribute("style", "border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;");

      // Add some bold text in the new cells:
      forlob.innerHTML = "Forløb";
      maal.innerHTML = "Færdigheds-og vidensmål";
      forslag.innerHTML = "Forslag til læringsmål";
      bemarkninger.innerHTML = "Bemærkninger";

      //table.innerHTML = "Hello!";
      doc.body.appendChild( table );

    };

  }

}]);