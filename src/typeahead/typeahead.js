angular.module('ui.bootstrap.typeahead', [])

  //attributes:
  //typeahead-source - source collection
  //typeahead-min-length - minimal no of chars before match occus - default 1
  //typeahead-items - max no of results displayed - no limit by default

  .directive('typeaheadSource', ['$http', '$templateCache', '$compile', '$filter', function ($http, $templateCache, $compile, $filter) {
  return {
    require:'ngModel',
    link:function (scope, element, attrs, modelCtrl) {

      $http.get('template/typeahead/typeahead.html', {
        cache:$templateCache
      }).success(function (tplContent) {

          var source = scope.$eval(attrs.typeaheadSource);
          var items = scope.$eval(attrs.typeaheadItems) || 100;

          var taScope = scope.$new(true);

          taScope.matches = [];
          //user requested type-ahead to be closed (ex. esc keypress)
          taScope.closed = false;
          //a value selected by a user from the type-ahead
          taScope.selectedValue = modelCtrl.$viewValue;

          scope.$watch(function () {
            return modelCtrl.$viewValue;
          }, function (newVal, oldVal) {
            if (newVal && newVal != oldVal && newVal != taScope.selectedValue) {
              taScope.matches = $filter('limitTo')($filter('filter')(source, newVal), items);
              taScope.closed = false;
              taScope.selectedValue = undefined;
              taScope.activeIdx = 0;
            } else {
              //empty query string
              taScope.matches = [];
            }
          });

          taScope.isOpen = function () {
            return !taScope.closed && taScope.matches.length > 0;
          };

          taScope.selectMatch = function(idx) {
            taScope.closed = true;
            taScope.selectedValue = taScope.matches[idx];
            modelCtrl.$setViewValue(taScope.selectedValue);
            modelCtrl.$render();
          };

          taScope.selectActive = function(idx) {
            taScope.activeIdx = idx;
          };

          taScope.isActive = function(idx) {
            return taScope.activeIdx === idx;
          };

          var tplElCompiled = $compile(tplContent)(taScope);
          element.after(tplElCompiled);

          element.bind('keydown', function (evt) {
            if (evt.which === 40) {
              //arrow down
              evt.preventDefault();

              taScope.activeIdx = (taScope.activeIdx + 1) % taScope.matches.length;
              taScope.$digest();
            } else if (evt.which === 38) {

              evt.preventDefault();

              //arrow down
              taScope.activeIdx = (taScope.activeIdx ? taScope.activeIdx : taScope.matches.length) - 1;
              taScope.$digest();
            } else if (evt.which === 13 || evt.which === 9) {
              //enter || tab
              evt.preventDefault();

              if (taScope.isOpen()) {
                scope.$apply(function () {
                  taScope.selectMatch(taScope.activeIdx);
                });
              }
            } else if (evt.which === 27) {
              //esc
              evt.preventDefault();

              taScope.closed = true;
              taScope.$digest();
            }
          });
        });
    }
  };
}]);

//TODO:
//- source can be a function called with the content of the $viewContrller
//- and order parameters
//- add ability to add custom matcher parameters
//- higligihting
//- add support to typeahead-min-length