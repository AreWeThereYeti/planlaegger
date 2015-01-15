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

// Function that maps each gyldendal product id to a unique color for display in export table head
  Dialog.getPlannerColor = function(productID){
    var color;
    switch (productID) {
      case "billedekunst1-2.gyldendal.dk":
        color = "#960202";
        break;
      case "dansk0-2.gyldendal.dk":
        color = "#960202";
        break;
      case "dansk3-6.gyldendal.dk":
        color = "#960202";
        break;
      case "dansk.gyldendal.dk":
        color = "#960203";
        break;
      case "religion.gyldendal.dk":
        color = "#3a9b7f";
        break;
      case "religion4-6.gyldendal.dk":
        color = "#3a9b7f";
        break;
      case "samfundsfag.gyldendal.dk":
        color = "#317182";
        break;
      case "tysk.gyldendal.dk":
        color = "#00B9A5";
        break;
      case "biologi.gyldendal.dk":
        color = "#3f7c31";
        break;
      case "fysik-kemi.gyldendal.dk":
        color = "#114275";
        break;
      case "matematik0-3.gyldendal.dk":
        color = "#30669a";
        break;
      case "matematik.gyldendal.dk":
        color = "#30669a";
        break;
      case "matematik4-6.gyldendal.dk":
        color = "#30669a";
        break;
      case "natur-teknologi4-6.gyldendal.dk":
        color = "#30679b";
        break;
      case "engelsk5-6.gyldendal.dk":
        color = "#31689e";
        break;
      case "engelsk.gyldendal.dk":
        color = "#31689e";
        break;
      case "engelsk0-2.gyldendal.dk":
        color = "#31689e";
        break;
      case "geografi.gyldendal.dk":
        color = "#326558";
        break;
      default:
        color = "#dc4320";
        break;
    }
    return color
  };

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
          " .btn {line-height: 40px; width: 250px; text-align: left; padding: 0px 15px; margin: 0;  cursor: pointer; outline: 0; border: none; color: #ffffff; background-color: #dc4320; font-family: arial, helvetica, sans-serif; font-size: 14px;}";

        x.styleSheet.cssText = t;
        doc.getElementsByClassName('head')[0].appendChild(x);

      } else {
        var t = doc.createTextNode(
/*          "table {" +
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
          "td {border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;}"+*/
          " .btn {line-height: 40px; width: 250px; text-align: left; padding: 0px 15px; margin: 0;  cursor: pointer; outline: 0; border: none; color: #ffffff; background-color: #dc4320; font-family: arial, helvetica, sans-serif; font-size: 14px;}"
        );
        x.appendChild(t);
        //exportWindow.document.getElementsByTagName("head")[0].appendChild(x);
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
        var periode = row.insertCell(0);
        periode.setAttribute("style", "border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;");

        var forlob = row.insertCell(1);
        forlob.setAttribute("style", "border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;");

        var maal = row.insertCell(2);
        maal.setAttribute("style", "border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;");

        var bemarkninger = row.insertCell(3);
        bemarkninger.setAttribute("style", "border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;");

        // fill forløb and mål cells with data
        forlob.innerHTML = exportObject.data[i].forloeb;
        maal.innerHTML = exportObject.data[i].maal;

      }

      // create table Head
      // Create an empty <thead> element and add it to the table:
      var header = table.createTHead();

      header.setAttribute("style", "background-color:"+Dialog.getPlannerColor($rootScope.current.subjects[0])+"; color: #FFFFFF; font-size: 14px; font-weight: bold;");

      // Create an empty <tr> element and add it to the <thead>:
      var row = header.insertRow(0);

      // Insert new cells (<td> elements) at the 1st and 2nd ... position of the "new" <tr> element:
      var periode = row.insertCell(0);
      var forlob = row.insertCell(1);
      var maal = row.insertCell(2);
      var bemarkninger = row.insertCell(3);

      // set cell widths
      periode.setAttribute("width", "12.5%");
      periode.setAttribute("style", "border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;");

      forlob.setAttribute("width", "20%");
      forlob.setAttribute("style", "border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;");

      maal.setAttribute("width", "42.5%");
      maal.setAttribute("style", "border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;");

      bemarkninger.setAttribute("width", "25%");
      bemarkninger.setAttribute("style", "border: 1px solid #000000; padding: 10px; vertical-align: top; font-size: 12px;");

      // Add some bold text in the new cells:
      periode.innerHTML = "Periode";
      forlob.innerHTML = "Forløb";
      maal.innerHTML = "Mål";
      bemarkninger.innerHTML = "Bemærkninger";

      //table.innerHTML = "Hello!";
      doc.body.appendChild( table );

    };

  }

}]);