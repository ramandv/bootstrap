
var demo = angular.module('DialogDemo', ['ui.bootstrap.dialog', 'template/dialog/message.html'], function(){});

demo.controller('DialogController', ['$scope', '$dialog', function($scope, $dialog){

	var t = '<div class="modal-header">'+
	'<h1>This is the title</h1>'+
'</div>'+
'<div class="modal-body">'+
	'<p>Enter a value to pass to close as the result: <input ng-model="result" /></p>'+
'</div>'+
'<div class="modal-footer">'+
	'<button ng-click="close(result)" class="btn btn-primary" >Close</button>'+
'</div>';

	$scope.dialogOptions = {
		backdrop: true,
		keyboard: true,
		backdropClick: true,
		template: t,
		controller: 'TestDialogController'
	};

	$scope.msgbox = {};

	$scope.open = function(){
		var d = $dialog.dialog($scope.dialogOptions);
		d.open().then(function(result){
			if(result) { alert('dialog closed with result: ' + result);  }
		});
	};

	$scope.messageBox = function(){
		var m = $dialog.messageBox(
			$scope.msgbox.title || 'This is a message box',
			$scope.msgbox.message || 'This is the message. Please click buttons below to confirm or dismiss.',
			[
				{result:'cancel', label:'Cancel'},
				{result:'ok', label:'Ok', cssClass:'btn-primary'}]);
		m.open().then(function(result){
			if(result) { alert('message box closed with result: ' + result);  }
		});
	};
}]);

demo.controller('TestDialogController',['$scope', 'dialog', function ($scope, dialog){
	$scope.d = dialog;
	$scope.close = function(result){
		dialog.close(result);
	};
}]);