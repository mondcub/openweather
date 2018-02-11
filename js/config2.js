'use strict';
angular.module('openWeatherApp.services', ['ngResource'])


  .value('version', '0.1.6')

  .value('exampleLocations',['Bangkok'])

  .value('stormLocations',['Sylt','St. Peter-Ording','Husum','Bremerhaven','Hamburg','Kiel','Lübeck'])
  .factory('openWeatherMap', function($resource) {
    var apiKey = '279b4be6d54c8bf6ea9b12275a567156';
    var apiBaseUrl = 'http://api.openweathermap.org/data/2.5/';

    return $resource(apiBaseUrl + ':path/:subPath?q=:location',
      {
        APPID: apiKey,
        mode: 'json',
        callback: 'JSON_CALLBACK',
        units: 'metric',
        lang: 'en'
      },
      {
        queryWeather: {
          method: 'JSONP',
          params: {
            path: 'weather'
          },
          isArray: false,
          headers: {
            'x-api-key': apiKey
          }
        },
        queryForecast: {
          method: 'JSONP',
          params: {
            path: 'forecast'
          },
          isArray: false,
          headers: {
            'x-api-key': apiKey
          }
        },
        queryForecastDaily: {
          method: 'JSONP',
          params: {
            path: 'forecast',
            subPath: 'daily',
            cnt: 7
          },
          isArray: false,
          headers: {
            'x-api-key': apiKey
          }
        }
      }
    )
  });
angular.module('openWeatherApp', [
  'ngRoute',
  'openWeatherApp.filters',
  'openWeatherApp.services',
  'openWeatherApp.directives',
  'openWeatherApp.controllers',
  "iso-3166-country-codes"
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/forecast', {templateUrl: 'partials/forecast2.html', controller: 'OpenWeatherCtrl'});
  $routeProvider.when('/storm', {templateUrl: 'partials/storm.html', controller: 'OpenWeatherCtrl'});
  $routeProvider.otherwise({redirectTo: '/forecast'});
}]);
angular.module('openWeatherApp.controllers', [])

  
  .controller('OpenWeatherCtrl',
    ['$scope','openWeatherMap','exampleLocations','stormLocations','ISO3166',
      function($scope,openWeatherMap,exampleLocations,stormLocations,ISO3166) {

    $scope.message = '';
    $scope.hasState = '';

   
    $scope.exampleLocations = exampleLocations;
    $scope.stormLocations = stormLocations;
    $scope.iconBaseUrl = 'http://openweathermap.org/img/w/';

    
    $scope.forecast = openWeatherMap.queryForecastDaily({
      location: exampleLocations[ 0 ]
    });

    
    $scope.getForecastByLocation = function() {

      if ($scope.location == '' || $scope.location == undefined) {
        $scope.hasState = 'has-warning';
        $scope.message = 'Please provide a location';
        return;
      }

      $scope.hasState = 'has-success';

      $scope.forecast = openWeatherMap.queryForecastDaily({
        location: $scope.location
      });
    };

    
    $scope.setLocation = function(loc) {
      $scope.location = loc;
      $scope.getForecastByLocation();
    };

    
    $scope.getIconImageUrl = function(iconName) {
      return (iconName ? $scope.iconBaseUrl + iconName + '.png' : '');
    };

	$scope.backPage = function() {
		location.href = "index.html"; 
    };

  }])

  angular.module('openWeatherApp.directives', [])

  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('weatherPanel',[function factory() {
    return {
      restrict: 'EA',

      scope: {
        useDayForecast: '=showEntry',
        forecast: '=weatherPanel'
      },

      templateUrl: 'partials/_weather-panel-light.html',

      link: function(scope, element, attrs) {
        // Get icon image url
        scope.getIconImageUrl = function(iconName) {
          return (iconName ? 'http://openweathermap.org/img/w/' + iconName + '.png' : '');
        };

        scope.parseDate = function (time) {
          return new Date(time * 1000);
        };
      }
    }
  }])
.directive('weatherPanelWind',[function factory() {
  return {
    restrict: 'EA',

    scope: {
      useDayForecast: '=showEntry',
      forecast: '=weatherPanel'
    },

    templateUrl: 'partials/_weather-panel-wind.html',

    link: function(scope, element, attrs) {
      // Get icon image url
      scope.getIconImageUrl = function(iconName) {
        return (iconName ? 'http://openweathermap.org/img/w/' + iconName + '.png' : '');
      };

      scope.parseDate = function (time) {
        return new Date(time * 1000);
      };
    }
  }
}]);
angular.module('openWeatherApp.filters', [])

  .filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])

  .filter('placeholder', [function() {
    return function (input,phvalue) {
      return (angular.isUndefined(input) || input == '') ? phvalue : input;
    };
  }])