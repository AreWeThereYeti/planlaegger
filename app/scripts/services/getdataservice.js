angular.module('gyldendal.services', [])
		.factory('getdataservice', ['$http', '$location', '$rootScope', function($http, $location, $rootScope) {
			var sdo= {

        getAllOrganizers: function(){
          var userID = 'mort088k'; // hardcoded userID for testing
          var returndata;

          var promise = $http({
            cache: false,
            headers: {
              'Content-Type'  : 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'GET',
            url: 'php/getOrganizers.php?userID=' + userID /*+ $location.search().userID <-- --- --- ComponentID er lige nu hardcoded. Skal hentes fra URL*/
          })
            .success(function (data, status, headers, config) {
              if (data) {
                console.log(data);


              }else{
                console.log("error on organizer data request. component data has not been loaded");
              }
            });

          return promise;
        },
        getOrganizer: function(params){

          var objectID = params.id ;

          var promise = $http({
            cache: false,
            headers: {
              'Content-Type'  : 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'GET',
            url: 'php/getOrganizer.php?objectID=' + objectID /*+ $location.search().userID <-- --- --- ComponentID er lige nu hardcoded. Skal hentes fra URL*/
          })
            .success(function (data, status, headers, config) {
              if (data) {
                console.log(data);


              }else{
                console.log("error on organizer data request. component data has not been loaded");
              }
            });

          return promise;
        },
        deleteOrganizer: function(plannerID) {



          var request = {
            "objectID": plannerID
          };

          var promise = $http({
            cache: false,
            headers: {
              'Content-Type'  : 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'POST',
            url: 'php/deleteOrganizer.php',
            data: angular.toJson(request)
          })
            .success(function (data, status, headers, config) {

            })
            .error(function(error){

            });

          return promise;
        },
        updateOrganizer: function(plannerInfo, objectID) {


          var request = {
            "objectID": objectID,
            "organizer": {
              "title":    plannerInfo.title,
              "subjects": plannerInfo.subjects,
              "levels":   plannerInfo.levels,
              "content":  plannerInfo.content
            }
          };
          console.log("request: "+request);

          var promise = $http({
            cache: false,
            headers: {
              'Content-Type'  : 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'POST',
            url: 'php/updateOrganizer.php',
            data: angular.toJson(request)
          })
            .success(function (data, status, headers, config) {
              if (data !== null) {
                console.log("response: "+JSON.stringify(data));
              }
            })
            .error(function(error){
              console.log("err: "+JSON.stringify(error));

            });

          return promise;
        },
        addOrganizer: function(plannerInfo) {

          //Needs userID
          var UserID = 'mort088k';

          var returndata;

          var request = {
            "organizer": {
              "userID":   UserID,
              "title":    plannerInfo.title,
              "subjects": plannerInfo.subjects,
              "levels":   plannerInfo.levels,
              "content":  angular.toJson(plannerInfo.content),
              "version": 2
            }
          };
          console.log("request: "+request);

          var promise = $http({
            cache: false,
            headers: {
              'Content-Type'  : 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'POST',
            url: 'php/addOrganizer.php',
            data: angular.toJson(request)
          })
            .success(function (data, status, headers, config) {
              if (data !== null) {
                console.log("response: "+JSON.stringify(data));
                //returndata = angular.fromJson(data);
              }
            })
            .error(function(error){
              console.log("err: "+JSON.stringify(error));

            });

          return promise;
        },
        getPlanner: function(plannerID) {

          var promise = $http.get('testjson/geografi7-9.json')

            .success(function (data, status, headers, config) {
              if (data) {
                console.log(angular.fromJson(data));


              }else{
                console.log("error on plannerservice data request. planner data has not been loaded");
              }
            });

          return promise;
        },
        getPlannerList: function() {

          var promise = $http.get('testjson/getList.json')

            .success(function (data, status, headers, config) {
              if (data) {
                console.log(angular.fromJson(data));


              }else{
                console.log("error on plannerservice data request. planner data has not been loaded");
              }
            });

          return promise;
        },

        loadComponent: function() {

            var ComponentID = '540025f23c5b5a07d0570c53';
            var returndata;

            var promise = $http({
              cache: false,
              headers: {
                'Content-Type'  : 'application/x-www-form-urlencoded;charset=utf-8'
              },
              method: 'GET',
              url: 'php/michael/load-component.php?componentID=' + '540025f23c5b5a07d0570c53' /*+ $location.search().componentID <-- --- --- ComponentID er lige nu hardcoded. Skal hentes fra URL*/
              })
                  .success(function (data, status, headers, config) {
                  if (data.Content !== null && angular.isDefined(data.Content)) {

                    returndata = angular.fromJson(data.Content);

                    //set settings in rootscope
                    $rootScope.backgroundImageID = returndata.settings.backgroundImageID;
                    $rootScope.download = returndata.settings.download;
                    $rootScope.fontFamily = returndata.settings.fontFamily;
                    $rootScope.fontSize = returndata.settings.fontSize;
                    $rootScope.listView = returndata.settings.listView;
                    $rootScope.mail = returndata.settings.mail;
                  }else{
                    console.log("error on component data request. component data has not been loaded");
                  }
              });

              return promise;
            },

        deleteEntry: function() {

            var returndata

            var promise = $http({
              cache: false,
              headers: {
                'Content-Type'  : 'application/x-www-form-urlencoded;charset=utf-8'
              },
              method: 'GET',
              url: 'php/deleteEntry.php?componentID=' + '540025f23c5b5a07d0570c53' /*+ $location.search().componentID <-- --- --- ComponentID er lige nu hardcoded. Skal hentes fra URL*/
              })
              .success(function (data, status, headers, config) {
              if (data.Content !== null) {
                returndata = angular.fromJson(data.Content);
              }
            });

            return promise;
          },
        getLatest: function() {

          //Needs userID and Component id
          var UserID = 'mort088k';
          var ComponentID = '540025f23c5b5a07d0570c53';

          var returndata;

          var promise = $http({
            cache: false,
            headers: {
              'Content-Type'  : 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'GET',
            url: 'php/getLatestEntry.php?userID=' + UserID + '&componentID=' + ComponentID /*+ $location.search().componentID <-- --- --- ComponentID er lige nu hardcoded. Skal hentes fra URL*/
            })
            .success(function (data, status, headers, config) {
            if (data.Content !== null) {
              returndata = angular.fromJson(data.Content);
            }
          });

          return promise;
        },
        addNewLog: function(log) {

          //Needs userID and Component id
          var UserID = 'mort088k';
          var ComponentID = '540025f23c5b5a07d0570c53';

          var returndata;

          var request = {
            "componentEntry": {
              "userID":         UserID,
              "componentID":    ComponentID,
              "componentType":  "i-log",
              "productID":      1111111111111,
              "title":          "some title",
              "content":        log
            }
          };
          console.log("request: "+request);

          var promise = $http({
            cache: false,
            headers: {
              'Content-Type'  : 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'POST',
            url: 'php/addEntry.php',
            data: angular.toJson(request)
          })
            .success(function (data, status, headers, config) {
              if (data !== null) {
                console.log("response: "+JSON.stringify(data));
                //returndata = angular.fromJson(data);
              }
            })
            .error(function(error){
              console.log("err: "+JSON.stringify(error));

            });

          return promise;
        },
        updateLog: function(newLogs, objectId) {

          var request = {
            "objectID":         objectId,
            "componentEntry": {
              "title":          "some title",
              "content":        angular.toJson(newLogs)
            }
          };

          console.log("request: "+request);

          var promise = $http({
            cache: false,
            headers: {
              'Content-Type'  : 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'POST',
            url: 'php/updateEntry.php',
            data: angular.toJson(request)
          })
            .success(function (data, status, headers, config) {
                console.log("response: "+JSON.stringify(data));
            })
            .error(function(error){
              console.log("err: "+JSON.stringify(error));

            });

           return promise;
        },
        deleteAllLogs: function(objectId) {

          // objectID of the entry to delete
          var request = {
            "objectID": objectId
          };

          var promise = $http({
            cache: false,
            headers: {
              'Content-Type'  : 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'POST',
            url: 'php/deleteEntry.php',
            data: angular.toJson(request)
          })
            .success(function (data, status, headers, config) {
              console.log("delete: "+data);
            });

          return promise;
        }

			};

			return sdo
		}]);