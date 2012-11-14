var angularUI = {};

angularUI.getTransitionEndEventName = (function(){

	var transitionEndEventName;

	return function () {
		if(transitionEndEventName) {
			return transitionEndEventName;
		}

		var el = document.createElement('trans');
		var transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		};

		for (var name in transEndEventNames){
			if (el.style[name] !== undefined) {
				transitionEndEventName = transEndEventNames[name];
			}
		}
		return transitionEndEventName;
	};
})();