angular.module('gyldendal.services')
  .factory('colorPickerService', [function() {
    var picker= {

      // Function that maps each gyldendal product id to a unique color for display in export table head
      getColor: function(productID) {
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
      }
    };
    return picker;
  }]);