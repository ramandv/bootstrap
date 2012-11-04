/*
*
*    Angular Bootstrap Carousel
*
*      The carousel has all of the function that the original Bootstrap carousel has, except for animations. Animaitons will be a part of Angular JS's core soon,
*      so at the moment there is no need to add them to the directive. 
*   
*      Template: <carousel interval="'none'"><slide>{{anything}}</slide></carousel>
*/
angular.module('ui.bootstrap.carousel', [])
 .controller('CarouselController', ['$scope','$timeout', function ($scope, $timeout) {
          //slides that can be any type of content. All that is kept track here is the active state. 
          var slides = $scope.slides = [];
          //interval Object used to cycle the carousel. 
          var intervalO;
          /*
          *   pause()
          *   pause the current state of the carousel. 
          *   
          */ 
          this.pause = function(){
            if($scope.interval != 'none'){
              clearInterval(intervalO);  
            }
          };
          /*
          *   resume()
          *   resume the carousel where it left off. 
          *   
          */  
          this.resume = function(){
            if($scope.interval != 'none'){
              this.startSlides();  
            }              
          };
          /*
          *   startSlides()
          *   called when the first slide is added to the carousel. sets a new interval object that is 
          *   used to keep track of the carousel.  
          */
          this.startSlides = function(){
            if($scope.interval !== undefined){
            intervalO = setInterval(function(){
              if($scope.i === slides.length - 1){
                $timeout(function(){
                  slides[$scope.i].active = false;
                  slides[0].active = true;
                  $scope.i = 0;
                });
              }
              else{
                $timeout(function(){
                  slides[$scope.i].active = false;
                  if(slides[$scope.i + 1] !== undefined){
                    slides[$scope.i + 1].active = true;
                    $scope.i++;
                  }
                });
              }
            },$scope.interval); 
            }
          };
          /*
          *   next()
          *   checks the scope.i variable to make sure the current location is not scope.length - 1. If it is then 
          *   make the first element in the array active.
          */
          this.next = function () {
           
            if($scope.i === slides.length - 1){
              $timeout(function(){
                slides[$scope.i].active = false;
                slides[0].active = true;
                $scope.i = 0;
              });                  
            }
            else{
              $timeout(function(){
                slides[$scope.i].active = false;
                if(slides[$scope.i + 1] !== undefined){
                  slides[$scope.i + 1].active = true;
                  $scope.i++;
                }
              });
            }
          };
          /*
          *   prev()
          *   checks the scope.i variable to make sure the current location is not zero. If it is then 
          *   make the last slide in the array active.
          */
          this.prev = function () {
            if($scope.i === 0){
              $timeout(function(){
                slides[0].active = false; 
                slides[slides.length - 1].active = true; 
                $scope.i = slides.length - 1;
              });                    
            }
            else{
              $timeout(function(){
                slides[$scope.i].active = false;    
                if(slides[$scope.i - 1] !== undefined){
                  slides[$scope.i - 1].active = true;
                  $scope.i--;
                }
              },1);
            }
          };
          /*
          *   addSlide()
          *   @param: slide = scope of the current slide
          *           xTraSlide = variable that tells the function a slide is being added after the initial creation of the directive, giving that slide a higher priority.
          *   When the directive is first called all of the transcluded slides are added to the scope's slide array. 
          *   Every time a slide's active state is changed the scope.i variable is updated, so the carousel knows where it currently is at all times. 
          */
          this.addSlide = function (slide,xTraSlide) {
            
            //if the length is zero then it is the first slide and should be set to active.  
            if(slides.length === 0){
              $scope.i = 0;
              slide.active = true;  

              this.startSlides();
            }
            //if a slide has its active tag set then make this current slide active. 
            else if(slide.active === true){
              slide.active = true;
              slides[$scope.i].active = false;
              $scope.i = slides.length;                
            }
            else{
              slide.active = false;
            }
            slides.push(slide);
          };
          /*
          *   removeSlide()
          *   @param: slide = scope of the current slide
          *   
          *   remove a slide from the scope and make sure that its active value is cleared and cleaned up after. 
          *   
          */
          this.removeSlide = function (slide) {
            if(slides.length > 0){
              //get the index of the slide inside the carousel
              var iOf = slides.indexOf(slide);
              //if active then make the proper adjustments for the next active slide
              if(slides[iOf].active === true){
                if(slides.length > 1){
                  if(iOf === slides.length - 1){
                    slides[0].active = true;
                  } 
                  else{
                    slides[iOf + 1].active = true;
                  }              
                }
                //if last slide then clear the interval so it will pause.
                else{
                  clearInterval(intervalO);
                }      
              }
              slides.splice(iOf, 1);
            }
          };
            
          }])
        .directive('carousel', function () {
            return {
              restrict:'E',
              transclude: true,
              controller: 'CarouselController' ,
              scope: {
                interval: '=interval'
              },    
              link:function (scope, element, attrs, carouselCtrl) {
          
              if(scope.interval != 'none'){
                carouselCtrl.interval = scope.interval;
              }
              
              scope.pause = function(){
                carouselCtrl.pause(scope);        
              };
                  
              scope.resume = function(){
                carouselCtrl.resume(scope);    
              };

              scope.next = function () {
                carouselCtrl.next(scope);
              };
              
              scope.prev = function () {
                carouselCtrl.prev(scope);      
              };
              
               scope.removeSlide = function () {
                carouselCtrl.prev(scope);     
              };

              scope.addSlide = function () {
                carouselCtrl.prev(scope)  ;    
              };
            },
            templateUrl:'template/carousel/carousel.html',
            replace:true
             
            };
        })
        .directive('slide', function () {
          return {
            require:'^?carousel',
            restrict:'E',
            transclude:true,
            scope:{
              active:'=active'
            },
            link:function (scope, element, attrs, carouselCtrl) {
              
              if(carouselCtrl !== undefined){
                carouselCtrl.addSlide(scope);

                scope.$on('$destroy', function (event) {
                  carouselCtrl.removeSlide(scope);
                });
              }
            },
            templateUrl: 'template/carousel/slide.html',
            replace: true
          };
         });
