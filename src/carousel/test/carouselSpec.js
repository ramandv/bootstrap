describe('carousel', function() {
  var elm, scope;

  // load the carousel code
  beforeEach(module('ui.bootstrap.carousel'));

  // load the templates

  beforeEach(module('template/carousel/carousel.html'));
  beforeEach(module('template/carousel/slide.html'));
 

  beforeEach(inject(function($rootScope, $compile) {
    // we might move this tpl into an html file as well...
    elm = angular.element(
      '<div>' +
        '<carousel interval=' + "none" + '>' +
          '<slide active="first.active">' +
            'first content is {{first.content}}' +
          '</slide>' +
          '<slide active="second.active">' +
            'second content is {{second.content}}' +
          '</slide>' +
        '</carousel>' +
      '</div>');

    scope = $rootScope;
    scope.first = {'active': false,'content': 123};
    scope.second = {'active': false,'content': 456};
    $compile(elm)(scope);

    scope.$digest();

  }));


  it('should create clickable prev nav button', inject(function($compile, $rootScope) {
    var navPrev = elm.find('a.left');
    var navNext = elm.find('a.right');

    expect(navPrev.length).toBe(1);
    expect(navNext.length).toBe(1);
  }));


  it('should bind the content to slides', inject(function($compile, $rootScope) {
    var contents = elm.find('div.slide-content');

    expect(contents.length).toBe(2);
    expect(contents.eq(0).text()).toBe('first content is 123');
    expect(contents.eq(1).text()).toBe('second content is 456');

    scope.$apply(function() {
      scope.first.content = 456;
      scope.second.content = 123;
    });

    expect(contents.eq(0).text()).toBe('first content is 456');
    expect(contents.eq(1).text()).toBe('second content is 123');
  }));

});


describe('carousel controller', function() {
  var scope, ctrl;
  //create an array of slides and add to the scope
  var slides = [{'active': false,'content': 123},{'active': false,'content': 456}];

  beforeEach(module('ui.bootstrap.carousel'));
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope;

    // instantiate the controller stand-alone, without the directive
    ctrl = $controller('CarouselController', {$scope: scope, $element: null});
    //add slides to the scope by running the carousels addSlide function
    for(var i = 0;i < slides.length;i++){
      ctrl.addSlide(slides[i]);
    }
  }));

  
  describe('addSlide', function() {

    it('should set first slide to active = true', function() {
    
      expect(scope.slides[0].content).toBe(123);
      expect(scope.slides[0].active).toBe(true);
      expect(scope.slides[1].active).not.toBe(true);
    });

    it('should have two slides in the scope', function() {
      
      expect(scope.slides).toEqual([slides[0], slides[1]]);
    });


    it('should add and new slide and change active to true if active is true on the added slide', function() { 
      var newSlide = {active: true};
      expect(scope.slides.length).toBe(2);
      //add the newSlide to the scope.
      ctrl.addSlide(newSlide,1);
      expect(scope.slides.length).toBe(3);
      //we want to set the slide as active now because the user has set to active. 
      expect(scope.slides[2].active).toBe(true);
      expect(scope.slides[0].active).toBe(false);
    });

    it('should add and new slide and not change the active slide', function() { 
      var newSlide = {active: false};
      expect(scope.slides.length).toBe(2);
      //add the newSlide to the scope.
      ctrl.addSlide(newSlide,1);
      expect(scope.slides.length).toBe(3);
      //we dont want to make the added slide active right away, it should just be in the carousel
      expect(scope.slides[2].active).toBe(false);
      expect(scope.slides[0].active).toBe(true);
    });


  });

});

  describe('remove slides', function() {

  beforeEach(module("ui.bootstrap.carousel", "template/carousel/carousel.html", "template/carousel/slide.html"));

  it('should remove slides when elements are destroyed and change selection', inject(function($controller, $compile, $rootScope) {
    var scope = $rootScope;
    var elm = $compile("<carousel><slide>Hello</slide><slide active='list[$index].active' ng-repeat='i in list'>content {{i}}</slide></carousel>")(scope);
    scope.$apply();
  
    function slides() {
      return elm.find('div.slide-content');
    }   
  
    expect(slides().length).toBe(1);
    scope.$apply('list = [{},{},{}]');
    waits(100);
    expect(slides().length).toBe(4);
    expect(scope.list[0].active).toBe(true);
    scope.$apply('list = [{},{active: true}]');
    expect(slides().length).toBe(3);
    expect(scope.list[1].active).toBe(true);
  }));

});

